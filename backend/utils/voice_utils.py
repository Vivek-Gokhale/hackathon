# voice_utils.py
import sys
import speech_recognition as sr
from googletrans import Translator

def voice_to_native(audio_path):
    r = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = r.record(source)
    text = r.recognize_google(audio, language='hi-IN')  # Hindi
    return text

def text_to_english(text):
    translator = Translator()
    translation = translator.translate(text, src='hi', dest='en')
    return translation.text

if __name__ == "__main__":
    action = sys.argv[1]
    if action == "voice":
        audio_path = sys.argv[2]
        print(voice_to_native(audio_path))
    elif action == "translate":
        native_text = sys.argv[2]
        print(text_to_english(native_text))
