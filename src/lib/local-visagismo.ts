import type { FaceAnalysisResult, FaceMetrics, Product } from '@/types';
import { products } from './mock-data';
import { recommendCatalogFrames } from './frame-recommendations';

type Point = { x: number; y: number };
type Shape = 'Redondo' | 'Quadrado' | 'Oval' | 'Coração' | 'Alongado';
export class FacePhotoError extends Error {}

const choices: Record<Shape, { advice: string }> = {
  Redondo: {
    advice: 'Linhas angulares e retangulares criam um contraste elegante com os contornos suaves das bochechas, trazendo definição e presença ao olhar.',
  },
  Quadrado: {
    advice: 'Armações com curvas suaves, aros arredondados ou aviadores suavizam a linha forte da mandíbula e alongam harmonicamente os traços.',
  },
  Oval: {
    advice: 'Proporção naturalmente harmônica. Você tem versatilidade para transitar entre armações ousadas, clássicas e formatos gatinho marcantes.',
  },
  Coração: {
    advice: 'Prefira armações que equilibrem a amplitude da testa com a delicadeza do queixo. Modelos finos, ovais ou com base arredondada são ideais.',
  },
  Alongado: {
    advice: 'Armações com boa altura vertical de lente e hastes marcadas ajudam a dividir o comprimento visual do rosto, trazendo equilíbrio perfeito.',
  },
};

let detectorPromise: Promise<import('@mediapipe/tasks-vision').FaceLandmarker> | undefined;

async function getDetector() {
  detectorPromise ??= (async () => {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
    const vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
    return FaceLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: '/mediapipe/face_landmarker.task', delegate: 'CPU' },
      runningMode: 'IMAGE',
      numFaces: 2,
      minFaceDetectionConfidence: 0.6,
      minFacePresenceConfidence: 0.6,
    });
  })().catch(error => {
    detectorPromise = undefined;
    throw error;
  });
  return detectorPromise;
}

function measureFace(landmarks: Point[], width: number, height: number) {
  const eyeLeft = landmarks[33];
  const eyeRight = landmarks[263];
  const angle = Math.atan2((eyeRight.y - eyeLeft.y) * height, (eyeRight.x - eyeLeft.x) * width);
  const centerX = ((eyeLeft.x + eyeRight.x) * width) / 2;
  const centerY = ((eyeLeft.y + eyeRight.y) * height) / 2;
  const aligned = landmarks.map(point => {
    const x = point.x * width - centerX;
    const y = point.y * height - centerY;
    return {
      x: x * Math.cos(angle) + y * Math.sin(angle),
      y: -x * Math.sin(angle) + y * Math.cos(angle),
    };
  });

  const distance = (a: number, b: number) => Math.abs(aligned[a].x - aligned[b].x);
  const cheekWidth = distance(234, 454);
  const jawWidth = distance(172, 397);
  const foreheadWidth = distance(127, 356);
  const faceHeight = Math.abs(aligned[152].y - aligned[10].y);

  const nose = aligned[1].x;
  const leftHalf = Math.abs(nose - aligned[234].x);
  const rightHalf = Math.abs(aligned[454].x - nose);
  const symmetry = Math.min(leftHalf, rightHalf) / Math.max(leftHalf, rightHalf);

  return {
    aspect: faceHeight / cheekWidth,
    jaw: jawWidth / cheekWidth,
    foreheadJaw: foreheadWidth / jawWidth,
    symmetry,
    eyeTilt: (Math.abs(angle) * 180) / Math.PI,
    faceWidth: cheekWidth / width,
  };
}

export function classifyFaceMetrics(metrics: ReturnType<typeof measureFace>): Shape | null {
  if (!Number.isFinite(metrics.aspect) || metrics.faceWidth < 0.12 || metrics.symmetry < 0.65 || metrics.eyeTilt > 22) {
    return null;
  }
  if (metrics.aspect >= 1.35) return 'Alongado';
  if (metrics.foreheadJaw >= 1.37 && metrics.jaw < 0.75) return 'Coração';
  if (metrics.jaw >= 0.82 && metrics.aspect <= 1.25) return 'Quadrado';
  if (metrics.aspect < 1.18) return 'Redondo';
  return 'Oval';
}

export async function analyzeFaceLocally(imageDataUrl: string, catalog: Product[] = products): Promise<FaceAnalysisResult> {
  const photo = new Image();
  photo.src = imageDataUrl;
  await photo.decode();

  const canvas = document.createElement('canvas');
  canvas.width = photo.naturalWidth;
  canvas.height = photo.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível para análise local.');
  ctx.drawImage(photo, 0, 0);

  // O WebAssembly do MediaPipe envia mensagens informativas do TensorFlow Lite para console.error,
  // o que aciona o overlay de erro de desenvolvimento do Next.js. Filtramos com segurança.
  const originalError = console.error;
  const originalWarn = console.warn;
  let result;
  try {
    console.error = (...args: unknown[]) => {
      const first = args.map(String).join(' ');
      if (
        /^\s*INFO: Created TensorFlow Lite XNNPACK delegate for CPU\.?\s*$/.test(first) ||
        first.includes('feedback manager')
      ) {
        return;
      }
      originalError.apply(console, args);
    };
    console.warn = (...args: unknown[]) => {
      const first = String(args[0] ?? '');
      if (first.includes('feedback manager') || first.includes('XNNPACK')) return;
      originalWarn.apply(console, args);
    };
    const detector = await getDetector();
    result = detector.detect(canvas);
  } finally {
    console.error = originalError;
    console.warn = originalWarn;
  }

  if (result.faceLandmarks.length === 0) {
    throw new FacePhotoError('Nenhum rosto nítido identificado. Envie uma foto frontal com boa iluminação e rosto descoberto.');
  }
  if (result.faceLandmarks.length > 1) {
    throw new FacePhotoError('Identificamos mais de um rosto. Envie uma foto individual para que o visagismo seja preciso.');
  }

  const rawMetrics = measureFace(result.faceLandmarks[0], photo.naturalWidth, photo.naturalHeight);
  const shape = classifyFaceMetrics(rawMetrics);

  if (!shape) {
    throw new FacePhotoError('Não foi possível estimar o contorno nesta imagem. Tente uma foto frontal centralizada.');
  }

  const metrics: FaceMetrics = {
    aspectRatio: Number(rawMetrics.aspect.toFixed(2)),
    jawToCheekRatio: Number(rawMetrics.jaw.toFixed(2)),
    foreheadToJawRatio: Number(rawMetrics.foreheadJaw.toFixed(2)),
    symmetryRatio: Number(rawMetrics.symmetry.toFixed(2)),
    isFrontal: rawMetrics.eyeTilt < 10,
    measurementDisclaimer: 'Estimativa anatômica baseada na captura digital — não constitui prescrição clínica.',
  };

  const pick = choices[shape];
  const ranked = recommendCatalogFrames(shape, catalog);
  const recommendedProducts = ranked.map(({ product, reason }) => ({
    productId: product.id,
    reason,
  }));

  const recommendedFrameShapes = [...new Set(ranked.map(({ product }) => product.frameShape))];

  return {
    source: 'local',
    faceShape: shape,
    description: `O contorno aparente é ${shape.toLowerCase()}. Usamos as proporções observadas na sua foto para sugerir armações que valorizem seus traços.`,
    styleAdvice: pick.advice,
    metrics,
    recommendedProducts,
    recommendedFrameShapes,
  };
}
