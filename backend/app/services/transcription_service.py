from faster_whisper import WhisperModel

_model = None


def get_model():
    global _model

    if _model is None:
        _model = WhisperModel("base", device="cpu", compute_type="int8")

    return _model


def transcribe_audio(audio_path: str) -> str:
    model = get_model()

    segments, _ = model.transcribe(audio_path)

    transcript_parts = []

    for segment in segments:
        transcript_parts.append(segment.text.strip())

    return " ".join(transcript_parts)