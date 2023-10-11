import logging
import json
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from app.constant import *
from app.grpc.socket_client import SocketClient
from datetime import datetime

from . import service
# Create your views here.
@csrf_exempt
def register_face(request):
    body = json.loads(request.body.decode('utf-8'))

    userId = body.get('userId')
    image = body.get("image")

    if userId is None:
        return {"message": "Missing user id"}

    if image is None:
        return {"message": "Missing image input"}
    
    try :
        service.save_face_feature(userId=userId, 
                                  image=image,
                                  model_name="OpenFace")
    except Exception as e:
        logging.exception(e)
        return HttpResponseBadRequest(e)
        
    return JsonResponse({"message" :  "Register successfully"})    

@csrf_exempt
def recognize_face(request): 
    body = json.loads(request.body.decode('utf-8'))
    client = SocketClient()
    userId = body.get('userId')
    roomId = body.get('roomId')
    isAbsence = body.get('absence')
    print("isAbsence", isAbsence)
    image = body.get("image")
    

    if userId is None:
        return {"message": "Missing user id"}

    if image is None:
        return {"message": "Missing image input"}
    
    try : 
        verification = service.verify_face(
            img_posted=image ,
            userId=userId,
            distance_metric= DISTANCE_METRIC,
            model_name= MODEL_NAME, 
            detector_backend = DETECTOR_BACKEND, 
        )
        if (verification == False and roomId != None and isAbsence == False):
            client.send("FACE_NOT_MATCH", "FACE_NOT_MATCH", datetime.now().strftime('%m/%d/%Y'), roomId, userId)            
        print(verification)
    except Exception as e:
        print(e)
        logging.exception(e)
        if (e.args[0] == "Face detection failed. Make sure that the picture contains only one face."):
            errorType = "MORE_THAN_ONE_FACE_DETECTED"
        elif (e.args[0] == "Face could not be detected. Please confirm that the picture is a face photo or consider to set enforce_detection param to False."):
            errorType = "NO_FACE_DETECTED"
        if roomId != None and isAbsence == False:
            client.send(errorType, str(e), datetime.now().strftime('%m/%d/%Y'), roomId, userId)
        return JsonResponse({"verification": False,
                             "type": errorType,
                             "message": str(e)})
    return JsonResponse({"verification": bool(verification)})
