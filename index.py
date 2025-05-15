import requests
import os
import cv2
import numpy as np

API_KEY = "tC6rH5fXO8e83LWZafzlS8nRWIDOg0psUhuiLQsVIofjPcntZATEThts"
headers = {
    "Authorization": API_KEY
}

image_count = 1000

# OpenCV 얼굴 감지기 로드
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# 얼굴 감지 함수
def has_face(img_data):
    img_array = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    return len(faces) > 0

# 다운로드 함수
def download_image(url, image_name):
    try:
        img_data = requests.get(url).content
        if has_face(img_data):
            with open(f"images/{image_name}.jpg", "wb") as file:
                file.write(img_data)
            print(f"✅ Saved: {image_name}")
            return True
        else:
            print(f"❌ Skipped (no face): {image_name}")
            return False
    except Exception as e:
        print(f"❌ Error downloading {image_name}: {e}")
        return False

# 이미지 검색
def fetch_images(query, num_images):
    page = 1
    per_page = 15
    saved = 0
    image_index = 0

    while saved < num_images:
        params = {
            "query": query,
            "page": page,
            "per_page": per_page
        }
        response = requests.get("https://api.pexels.com/v1/search", headers=headers, params=params)

        if response.status_code != 200:
            print(f"❌ Error fetching: {response.status_code}")
            break

        data = response.json()
        photos = data.get("photos", [])
        if not photos:
            print("❗ No more photos found.")
            break

        for photo in photos:
            if saved >= num_images:
                break
            success = download_image(photo['src']['original'], image_index)
            if success:
                saved += 1
            image_index += 1

        page += 1

if not os.path.exists("images"):
    os.makedirs("images")

fetch_images("1 person rear view", image_count)