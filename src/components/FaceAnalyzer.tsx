'use client';

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Camera,
  Check,
  ImagePlus,
  Info,
  LoaderCircle,
  Lock,
  RotateCcw,
  ScanFace,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import type { FaceAnalysisResult } from '@/types';
import { FaceResult } from './FaceResult';
import { trackEvent } from '@/lib/analytics';

type Stage = 'upload' | 'preview' | 'loading' | 'result';

export function FaceAnalyzer() {
  const [stage, setStage] = useState<Stage>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<FaceAnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  function stopCamera() {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }

  useEffect(() => () => streamRef.current?.getTracks().forEach(track => track.stop()), []);

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => { /* autoplay bloqueado */ });
    }
  }, [cameraOpen]);

  async function processFile(file?: File) {
    setError('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato não suportado. Envie uma foto JPG, PNG ou WebP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('A foto deve ter até 10 MB.');
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas indisponível');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      setImage(canvas.toDataURL('image/jpeg', 0.88));
      setStage('preview');
      stopCamera();
    } catch {
      setError('Não foi possível ler a foto. Tente enviar outro arquivo.');
    }
  }

  async function openCamera() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      setError('Câmera indisponível ou permissão não concedida. Você pode carregar uma foto da sua galeria.');
    }
  }

  function takePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setError('Aguarde a câmera iniciar totalmente.');
      return;
    }
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1200 / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL('image/jpeg', 0.85));
    setStage('preview');
    stopCamera();
  }

  async function analyze(mode: 'gemini' | 'local') {
    if (!image) return;
    if (!lgpdAccepted) {
      setError('É necessário aceitar os termos de consentimento temporário da foto para continuar.');
      return;
    }

    setError('');
    setStage('loading');
    trackEvent('visagismo_started', { mode });

    try {
      let analysis: FaceAnalysisResult;
      if (mode === 'local') {
        const { analyzeFaceLocally } = await import('@/lib/local-visagismo');
        analysis = await analyzeFaceLocally(image);
      } else {
        try {
          const response = await fetch('/api/visagismo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image }),
          });
          const data = await response.json();
          if (response.ok) {
            analysis = data as FaceAnalysisResult;
          } else if (response.status >= 500) {
            const { analyzeFaceLocally } = await import('@/lib/local-visagismo');
            analysis = await analyzeFaceLocally(image);
          } else {
            throw new Error(data.error || 'Não foi possível analisar os traços faciais.');
          }
        } catch (fetchErr) {
          const { analyzeFaceLocally } = await import('@/lib/local-visagismo');
          analysis = await analyzeFaceLocally(image);
        }
      }

      setResult(analysis);
      setStage('result');
      trackEvent('visagismo_completed', {
        faceShape: analysis.faceShape,
        source: analysis.source,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocorreu uma instabilidade na análise. Tente novamente.');
      setStage('preview');
    }
  }

  function restart() {
    stopCamera();
    setImage(null);
    setResult(null);
    setStage('upload');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    processFile(event.dataTransfer.files[0]);
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    processFile(event.target.files?.[0]);
  }

  return (
    <div id="experimente" className="scroll-mt-28">
      {/* Indicador de Etapas */}
      <div className="mb-10 flex items-center justify-center gap-4 sm:gap-6" aria-label="Etapas do visagismo">
        {[
          ['01', 'Sua Foto'],
          ['02', 'Leitura Biométrica'],
          ['03', 'Harmonização & Estilo'],
        ].map(([n, label], i) => (
          <div key={n} className="flex items-center gap-3 sm:gap-5">
            <span
              className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider ${
                stage === 'result' ||
                (stage === 'loading' && i <= 1) ||
                (stage === 'preview' && i === 0) ||
                (stage === 'upload' && i === 0)
                  ? 'text-primary'
                  : 'text-ink/35'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${
                  stage === 'result' ||
                  (stage === 'loading' && i <= 1) ||
                  (stage === 'preview' && i === 0) ||
                  (stage === 'upload' && i === 0)
                    ? 'bg-accent text-[#FAF8F5]'
                    : 'bg-sand text-ink/50'
                }`}
              >
                {stage === 'result' && i < 2 ? <Check size={14} /> : n}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </span>
            {i < 2 && <span className="h-px w-8 bg-sand sm:w-16" />}
          </div>
        ))}
      </div>

      {stage === 'result' && result ? (
        <FaceResult result={result} onRestart={restart} />
      ) : (
        <div className="mx-auto max-w-3xl rounded-3xl border border-sand bg-paper p-6 sm:p-10 shadow-xl">
          {stage === 'upload' && (
            <>
              <div className="mb-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-light text-accent border border-sand">
                  <ScanFace size={28} />
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary">
                  Descubra a moldura certa para seu rosto
                </h2>
                <p className="mt-2 text-sm text-ink/70 max-w-md mx-auto">
                  Envie uma foto frontal, com expressão natural e contorno das maçãs e queixo visíveis.
                </p>
              </div>

              {cameraOpen ? (
                <div className="overflow-hidden rounded-2xl bg-primary">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="aspect-video w-full object-cover"
                  />
                  <div className="flex justify-center gap-4 p-4 bg-primary/90">
                    <button type="button" onClick={takePhoto} className="btn-primary">
                      <Camera size={17} /> Capturar Foto
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="rounded-full px-5 text-sm font-semibold text-white/80 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={onDrop}
                  className="rounded-2xl border-2 border-dashed border-accent/40 bg-light/70 px-6 py-12 text-center transition hover:border-accent hover:bg-light"
                >
                  <UploadCloud size={38} className="mx-auto text-accent" />
                  <p className="mt-4 text-base font-semibold text-primary">
                    Arraste sua foto para esta área
                  </p>
                  <p className="mt-1 text-xs text-ink/50">
                    Formatos JPG, PNG ou WebP · Até 10 MB
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onInput}
                    className="sr-only"
                    aria-label="Selecionar imagem do rosto"
                  />
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="btn-primary"
                    >
                      <ImagePlus size={16} /> Escolher Foto
                    </button>
                    <button
                      type="button"
                      onClick={openCamera}
                      className="btn-outline"
                    >
                      <Camera size={16} /> Abrir Câmera
                    </button>
                  </div>
                </div>
              )}

              {/* Termo de Consentimento LGPD */}
              <div className="mt-6 rounded-2xl border border-sand bg-sand/30 p-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lgpdAccepted}
                    onChange={e => setLgpdAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-accent text-accent focus:ring-accent"
                  />
                  <span className="text-xs text-ink/75 leading-relaxed">
                    <strong>Privacidade & LGPD:</strong> Concordo que a foto enviada será utilizada unicamente para estimar as proporções anatômicas no cálculo do visagismo e <em>descartada da memória temporária imediatamente após a geração do laudo</em>, sem armazenamento permanente de biometria facial.
                  </span>
                </label>
              </div>
            </>
          )}

          {stage === 'preview' && image && (
            <>
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-sand pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    Foto Carregada
                  </span>
                  <h2 className="text-2xl font-semibold text-primary mt-0.5">
                    Tudo pronto para o cálculo
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={restart}
                  className="flex items-center gap-1.5 text-xs font-semibold text-ink/60 hover:text-accent transition"
                >
                  <RotateCcw size={14} /> Trocar foto
                </button>
              </div>

              <div className="relative mx-auto aspect-[4/3] max-w-sm overflow-hidden rounded-2xl bg-light border border-sand shadow-sm">
                <Image
                  src={image}
                  alt="Prévia da foto para visagismo"
                  fill
                  unoptimized
                  sizes="384px"
                  className="object-contain"
                />
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => analyze('local')}
                  className="btn-olive shadow-lg"
                >
                  <ScanFace size={18} />
                  <span>Análise no Navegador (MediaPipe)</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => analyze('gemini')}
                  className="btn-outline"
                >
                  <Sparkles size={17} />
                  <span>Curadoria Avançada (Gemini IA)</span>
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-ink/60 max-w-md mx-auto leading-relaxed">
                No modo <strong>MediaPipe</strong>, a leitura dos pontos anatômicos e proporções é processada integralmente no seu aparelho via WebAssembly.
              </p>
            </>
          )}

          {stage === 'loading' && (
            <div className="py-20 text-center">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-light border border-sand">
                <LoaderCircle size={44} className="animate-spin text-accent" />
                <span className="absolute inset-[-8px] animate-pulse rounded-full border border-accent/20" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-primary">
                Mapeando proporções e simetria...
              </h2>
              <p className="mt-2 text-sm text-ink/65">
                Calculando a relação entre maçãs, mandíbula e altura facial para selecionar as armações Nezzo ideais.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
              <Info size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
