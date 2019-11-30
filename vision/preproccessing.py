import cv2
import numpy as np
from PIL import Image
from random import randint
from vision.search_symbols import SearchSymbols


class PreprocessingFlatNumber(object):
    def __init__(self, model):
        self.blur = 5  # medianBlur
        self.search = SearchSymbols(model)

    def standardize(self, image):
        src_threshold = cv2.cvtColor(image.copy(), cv2.COLOR_BGR2GRAY)
        ret, src_threshold = cv2.threshold(src_threshold, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        src_threshold = cv2.medianBlur(src_threshold, self.blur)  # Default Blur=5
        angle = self.get_angle(src_threshold)
        src_threshold = self.rotate_image(src_threshold, angle)
        bottomBound = self.get_bottom_bound(src_threshold)
        topBound = self.get_top_bound(src_threshold)
        src_threshold = src_threshold[int(topBound):int(bottomBound)]
        leftBound = max(self.get_left_bound(src_threshold, True), self.get_left_bound(src_threshold, False))
        rightBound = min(self.get_right_bound(src_threshold, True), self.get_right_bound(src_threshold, False))
        image = self.rotate_image(image, angle)
        image = image[int(topBound):int(bottomBound), leftBound:rightBound]
        height, width = image.shape[:2]
        if height < 61 and width < 240:
            image = cv2.resize(image, (240, 61))
        return image

    def rotateImage(self, image, angle):
        image_center = tuple(np.array(image.shape) / 2)
        rot_mat = cv2.getRotationMatrix2D(image_center, angle, 1.0)
        result = cv2.warpAffine(image, rot_mat, image.shape, flags=cv2.INTER_LINEAR)
        return result


    def hisEqulColor(self, img):
        ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCR_CB)
        channels = cv2.split(ycrcb)
        clahe = cv2.createCLAHE(clipLimit=1.8, tileGridSize=(8, 8))
        channels[0] = clahe.apply(channels[0])
        cv2.merge(channels, ycrcb)
        cv2.cvtColor(ycrcb, cv2.COLOR_YCR_CB2BGR, img)
        # kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
        # img = cv2.filter2D(img, -1, kernel)
        return img

    def find_letters(self, image):
        height, width = image.shape[:2]
        gray_scale = self.hisEqulColor(image)
        gray_scale = cv2.cvtColor(gray_scale, cv2.COLOR_BGR2GRAY)
        # cv2.imshow("number orig", gray_scale)
        # #cv2.imshow("number detection", rect_eq_image)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
        #blured = cv2.GaussianBlur(gray_scale,(3,3),0)
        # clahe = cv2.createCLAHE(clipLimit=1.8, tileGridSize=(8, 8))
        # gray_scale = clahe.apply(gray_scale)
        mser = cv2.MSER_create()
        regions = mser.detectRegions(gray_scale)
        regions = sorted(regions[0], key=cv2.boundingRect)
        rectangles = []
        for region in regions:
            rect = cv2.boundingRect(region)
            rectangles.append(rect)
        del regions


        # cv2.imshow("number orig", image)
        # #cv2.imshow("number detection", rect_eq_image)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        licenseSymbolsRaw = []
        licenseSymbolsSegments = []
        rect_eq_image = gray_scale
        for contour in rectangles:
            x_, y_, w_, h_ = contour
            if w_ >= 10 and h_ >= 10:
                symbol = gray_scale[y_: int(y_ + h_), x_: int(x_ + w_)]
                licenseSymbolsRaw.append(contour)
                symbol = cv2.resize(symbol, (50, 50))
                cv2.equalizeHist(symbol, symbol)
                licenseSymbolsSegments.append(symbol)



        exists_symbols = self.search.predict(licenseSymbolsSegments)
        del licenseSymbolsSegments


        roi_segments = []
        for i in range(len(exists_symbols)):
            if int(exists_symbols[i][0]) != int(14): 
                roi_segments.append({'roi':licenseSymbolsRaw[i],'answer':exists_symbols[i][1],'class':exists_symbols[i][0],
                                     'error':exists_symbols[i][2]})


        # for contour in roi_segments:
        #     x_, y_, w_, h_ = contour['roi']
        #     if w_ >= 10 and h_ >= 10:
        #         cv2.rectangle(image, (x_, y_), (int(x_ + w_), int(y_ + h_)), (0, 0, 0), 2)
        #
        # cv2.imshow("number detection", image)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        del licenseSymbolsRaw

        roi_segments = cv2.groupRectangles([x['roi'] for x in roi_segments], 1, 0.5)

        licenseSymbols = []
        rect_eq_image = gray_scale
        for item in roi_segments[0]:
            x_, y_, w_, h_ = item
            if w_ >= 10 and h_ >= 10:
                symbol = gray_scale[y_: int(y_ + (h_)), x_: int(x_ + (w_))]
                symbol = cv2.resize(symbol, (50, 50))
                cv2.equalizeHist(symbol, symbol)
                licenseSymbols.append(symbol)
                cv2.rectangle(rect_eq_image, (x_, y_), (int(x_ + w_ ), int(y_ + h_ )), (0, 0, 0), 2)

        # cv2.imshow("number detection", rect_eq_image)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        return licenseSymbols

    def box_crop_image(self, height, width, blockSize, step):
        points = []
        for y in range(0, int(height - blockSize), step):
            for x in range(0, int(width - blockSize), step):
                points.append([int(y), int(x), int(y + blockSize), int(x + blockSize)])
        return points

    def get_angle(self, image, minDegree=-10, maxDegree=10, stepDegree=0.1):
        height, width = image.shape[:2]
        min_p = height
        angle = 0
        rn = np.arange(minDegree, maxDegree, stepDegree)
        for a in rn:
            temp = image
            temp = self.rotate_image(temp, a)
            bottomBound = self.get_bottom_bound(temp)
            if bottomBound < min_p:
                angle = a
                min_p = bottomBound
        return angle

    def rotate_image(self, image, angle):
        rows, cols = image.shape[0:2]
        center = (cols / 2, rows / 2)
        scale = 1
        rot_mat = cv2.getRotationMatrix2D(center, angle, scale)
        Rotated_Image = cv2.warpAffine(image, rot_mat, (cols, rows))
        return Rotated_Image

    def get_top_bound(self, image):
        height, width = image.shape[:2]
        for i in range(1, int(height / 2 + 1), 1):
            data = image[i:i + 1]
            count = cv2.countNonZero(data)
            if count > height / 2:
                return i
        return 0

    def get_bottom_bound(self, image):
        height, width = image.shape[:2]
        lastCount = 0
        data = np.ones((1, width), np.uint8)
        for i in range(int(height / 2), height, 1):
            data[0, :] = image[i, :]
            count = cv2.countNonZero(data)
            if count < lastCount / 2:
                return i
            lastCount = count
        return height

    def get_left_bound(self, image, iswhite):
        element = cv2.getStructuringElement(cv2.MORPH_RECT, (2 * 1 + 1, 2 * 1 + 1))
        image = cv2.erode(image, element)
        image = cv2.dilate(image, element)
        height, width = image.shape[:2]
        for i in range(2, int(width / 2), 1):
            data = image[:, i]
            count = cv2.countNonZero(data)
            if ((not iswhite) and (count > height / 2)) or ((iswhite) and (count > height * 0.6)):
                return i
        return 0

    def get_right_bound(self, image, iswhite):
        element = cv2.getStructuringElement(cv2.MORPH_RECT, (2 * 1 + 1, 2 * 1 + 1))
        image = cv2.erode(image, element)
        image = cv2.dilate(image, element)
        height, width = image.shape[:2]
        for i in range(width - 2, int(width / 2), -1):
            data = image[:, i]
            count = cv2.countNonZero(data)
            if ((not iswhite) and (count > height / 2)) or ((iswhite) and (count > height * 0.6)):
                return i + 1
        return width
