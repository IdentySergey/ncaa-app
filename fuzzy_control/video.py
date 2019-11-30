import numpy as np
import cv2
import matplotlib.pyplot as plt
import threading

#x = 0
#cap = vlc.MediaPlayer('rtsp://10.96.96.31/live/h264')
#cap = cv2.VideoCapture('http://192.168.77.146:8080/camera.avi')
#cap = cv2.VideoCapture('vtest.avi')
#fgbg = cv2.createBackgroundSubtractorMOG2()

#cap.open("http://192.168.77.146:8080/camera.avi")
#cap.set(3, 320)
#cap.set(4, 240)

def blobDetect(im, mask):
    params = cv2.SimpleBlobDetector_Params()

    # Change thresholds
    params.minThreshold = 200
    params.maxThreshold = 255

    # Filter by Area.
    params.filterByArea = True
    params.minArea = 1000

    #Filter by Color
    params.filterByColor = False
    params.blobColor = 0


    # Filter by Circularity
    params.filterByCircularity = False
    params.minCircularity = 0.1

    # Filter by Convexity
    params.filterByConvexity = True
    params.minConvexity = 0.5

    # Filter by Inertia
    params.filterByInertia = False
    params.minInertiaRatio = 0.4

    # Create a detector with the parameters
    ver = (cv2.__version__).split('.')
    if int(ver[0]) < 3:
        detector = cv2.SimpleBlobDetector(params)
    else:
        detector = cv2.SimpleBlobDetector_create(params)

    # Detect blobs.
    keypoints = detector.detect(mask)

    # Draw detected blobs as red circles.
    # cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS ensures
    # the size of the circle corresponds to the size of blob

    im_with_keypoints = cv2.drawKeypoints(im, keypoints, np.array([]), (0, 0, 255),
                                          cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
    #print(keypoints)
    text = len(keypoints)/5
    '''if text < 10:
        movement = 'low'
    else:
        movement = 'high'
    '''
    #print('movement = ', text)
    # Show blobs
    return text

def frame_hist(frame):
    histr = cv2.calcHist([frame], [0], None, [256], [0,256])
    m=0
    n = 0
    for i in range(len(histr)):
        if m < histr[i]:
            m = histr[i]
            n = i
    return n/21.3


'''
while(True):
    # Capture frame-by-frame
    #cap.open(1)
    
    ret, frame = cap.read()
    fgmask = fgbg.apply(frame)
    #frame = blobDetect(frame, fgmask)
    cv2.imshow('frame',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
'''

