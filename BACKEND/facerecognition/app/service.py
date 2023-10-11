import base64
import pickle
import numpy as np

from deepface import DeepFace
from app.constant import *
from app.models import Users
from deepface.commons import functions,  distance as dst

def make_image_valid(image) :
    return image + "="*(4 - len(image.split(",")[1])%4)

def verify_face(
        img_posted,
        userId,
        model_name=MODEL_NAME,
        detector_backend=DETECTOR_BACKEND,
        distance_metric=DISTANCE_METRIC,
        enforce_detection=True,
        align=True,
        normalization="base",):
    
    target_size = functions.find_target_size(model_name=model_name)

    # image posted might have many faces
    img1_objs = functions.extract_faces(
        img=make_image_valid(img_posted),
        target_size=target_size,
        detector_backend=detector_backend,
        grayscale=False,
        enforce_detection=enforce_detection,
        align=align,
    )

    if (len(img1_objs) > 1): 
        raise ValueError("Face detection failed. Make sure that the picture contains only one face.")

    img2_content = pickle.loads(Users.objects.get(id = userId).face_feature)

    # --------------------------------
    distances = []

    # now we will find the face pair with minimum distance
    for img1_content, _, _ in img1_objs:

            img1_embedding_obj = DeepFace.represent(
                img_path=img1_content,
                model_name=model_name,
                enforce_detection=enforce_detection,
                detector_backend="skip",
                align=align,
                normalization=normalization,
            )

            img2_embedding_obj = DeepFace.represent(
                img_path=img2_content,
                model_name=model_name,
                enforce_detection=enforce_detection,
                detector_backend="skip",
                align=align,
                normalization=normalization,
            )

            img1_representation = img1_embedding_obj[0]["embedding"]
            img2_representation = img2_embedding_obj[0]["embedding"]

            if distance_metric == "cosine":
                distance = dst.findCosineDistance(img1_representation, img2_representation)
            elif distance_metric == "euclidean":
                distance = dst.findEuclideanDistance(img1_representation, img2_representation)
            elif distance_metric == "euclidean_l2":
                distance = dst.findEuclideanDistance(
                    dst.l2_normalize(img1_representation), dst.l2_normalize(img2_representation)
                )
            else:
                raise ValueError("Invalid distance_metric passed - ", distance_metric)

            distances.append(distance)

    # -------------------------------
    threshold = dst.findThreshold(model_name, distance_metric)
    distance = min(distances)  # best distance
    
    return distance <= threshold



def save_face_feature(userId, image,model_name="VGG-Face",):
    target_size = functions.find_target_size(model_name=model_name)

    face_features = functions.extract_faces(
        img=make_image_valid(image),
        target_size=target_size,
        detector_backend=DETECTOR_BACKEND,
        enforce_detection=False,
        align=True,
        grayscale=False,
    )

    if (len(face_features) != 1): 
        raise ValueError("Face detection failed. Make sure that the picture contains only one face.")
    
    user = Users.objects.get(id = userId)
    user.face_feature = pickle.dumps(face_features[0][0])
    user.save()    

