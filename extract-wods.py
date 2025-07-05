import re
import os
import shutil
from PIL import Image
import pytesseract

# Folders
input_folder = './comptrain.co'
output_folder = './images_wod'
markdown_file = './wods.md'

# Ensure output folder exists
os.makedirs(output_folder, exist_ok=True)

carousels = {}
for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        prefix = filename.rsplit('_', 1)[0]
        carousels.setdefault(prefix, []).append(filename)

def contains_wod(text):
    text_lower = text.lower()

    wod_patterns = [
        r'\bfor time\b',
        r'\bamrap\b\s*\d+',
        r'\bemom\b\s*\d+',
        r'\b\d+\s*rounds?\b',
        r'\b\d{2}-\d{2}-\d{2}\b',
        r'\bbuy[- ]?in\b',
        r'\bcash[- ]?out\b',
        r'\bround\s+\d+\b',
        r'\bmin\b.*?\d+',
        r'\d+\s+reps?',
        r'\b\d+\s*sets\s*of\s*\d+',
    ]

    for pattern in wod_patterns:
        if re.search(pattern, text_lower):
            return True
    return False

def is_promotional_text(text):
    # List of possible promotional message variants (normalized)
    promo_variants = [
        # Classic variants
        "get a full day of training with a 2 week free trial comptrain",
        "get a full day of training witha 2 week free trial comptrain",
        "get a full day of training with a 2 week free trial",
        "get a full day of training witha 2 week free trial",
        # App/2 weeks free
        "try out the training with 2 weeks free in the app comptrain",
        "try out the training with 2 weeks free in the app",
        "2 weeks free in the app comptrain",
        "2 weeks free in the app",
        # Want to learn more
        "want to learn more give the training a shot with 2 weeks free in the app",
        "give the training a shot with 2 weeks free in the app",
        # Want to see the full day
        "want to see the full day of training hop in the app and start a 2 week free trial",
        "hop in the app and start a 2 week free trial",
        # Give the app a try
        "give the app a try for 2 weeks for free",
        # Check out the full day
        "check out the full day of training in the app",
        # Strength train with us
        "strength train with us in the app for 2 weeks for free",
        # Join us in the app
        "join us in the app to give the training a shot with 2 weeks free",
        # Swipe to see a small part
        "swipe to see a small part of the bigger picture",
        # Partitioned/shorter forms
        "2 week free trial comptrain",
        "2 week free trial",
        "2 weeks free comptrain",
        "2 weeks free",
    ]
    # Normalize text: lowercase, remove punctuation, collapse whitespace
    normalized = text.strip().lower()
    normalized = re.sub(r'[^a-z0-9\s]', '', normalized)
    normalized = re.sub(r'\s+', ' ', normalized)
    for promo in promo_variants:
        promo_norm = promo.strip().lower()
        promo_norm = re.sub(r'[^a-z0-9\s]', '', promo_norm)
        promo_norm = re.sub(r'\s+', ' ', promo_norm)
        if promo_norm and promo_norm in normalized:
            return True
    return False

# Remove markdown file if it exists
if os.path.exists(markdown_file):
    os.remove(markdown_file)

excluded_dates = [
    "2025-05-04_10-00-34_UTC",
    "2025-03-30_22-05-18_UTC",
    "2025-04-10_16-01-44_UTC",
    "2025-04-21_13-00-53_UTC",
    "2025-06-02_10-00-36",
    "2025-04-04_11-55-19_UTC",
    "2025-05-12_16-10-19_UTC",
    "2025-04-14_13-00-55_UTC",
]

# Analyze carousels
for prefix, files in carousels.items():
    if prefix in excluded_dates:
        print(f"⏭️ WOD excluded for date {prefix}.")
        continue
    print(f"🔍 Analyzing carousel {prefix}...")
    texts = {}
    match = False

    # Sort image files to ensure order
    files_sorted = sorted(files)

    for filename in files_sorted:
        path = os.path.join(input_folder, filename)
        try:
            image = Image.open(path)
            text = pytesseract.image_to_string(image)
            texts[filename] = text
            if not match and contains_wod(text):
                match = True
        except Exception as e:
            print(f"Error with {filename}: {e}")

    if match:
        print(f"✅ WOD detected in {prefix}, exporting to markdown and copying images.")
        # Copy images to output folder and write to markdown, skipping promotional images
        for f in files_sorted:
            if is_promotional_text(texts[f]):
                print(f"⏭️ Skipping promotional image: {f}")
                continue
            shutil.copy2(os.path.join(input_folder, f), os.path.join(output_folder, f))
        with open(markdown_file, 'a', encoding='utf-8') as md:
            md.write(f"## {prefix}\n\n")
            for f in files_sorted:
                if is_promotional_text(texts[f]):
                    continue
                md.write(f"**Image : {f}**\n\n")
                md.write("```\n")
                md.write(texts[f].strip() + '\n')
                md.write("```\n\n")
    else:
        print(f"❌ No WOD found in {prefix}.")
        # Delete all images in this carousel
        for f in files_sorted:
            img_path = os.path.join(input_folder, f)
            try:
                os.remove(img_path)
                print(f"🗑️ Deleted unused image: {f}")
            except Exception as e:
                print(f"⚠️ Could not delete {f}: {e}")
