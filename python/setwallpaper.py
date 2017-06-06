#coding=utf-8
'''
python 2.x
每日下载bing搜索的图片，并将其下载到本地，然后设置为桌面壁纸
'''
import os
import urllib
import time
import Image
import win32gui,win32con,win32api
STORE_DIR = 'E:/QA - WZW/Pictures/'
class BingPic(object):
    # 从bing主页得到html
    def readCNBingPage(self):
        return urllib.urlopen("http://cn.bing.com").read()
    # 分析出图片地址
    def getBingImageUrl(self, content):
        tagpos = content.find("g_img=")
        if tagpos <> -1:
            imageStart = content.find("'", tagpos)
            imageEnd = content.find("',", tagpos)
            return content[imageStart + 1:imageEnd]
        if tagpos == -1:
            print "解析标签失败，可能页面格式已经改变!"
            return -1
    # 下载图片
    def downLoadBingImage(self, url):
        if url.startswith("http"):
            picName = url[url.rfind("/") + 1:]
            picName = STORE_DIR + time.strftime("%Y-%m-%d",time.localtime()) + "_" + picName
            print "准备下载:" + url
            if os.path.exists(STORE_DIR):
                pass
            else:
                os.makedirs(STORE_DIR)   
            urllib.urlretrieve(url, picName)
            print "保存 " + picName + " 在当前路径下!"
            return picName
        else:
            print url + " 不是一个正确的图片URL地址!"
            return -1
    # 设置图片为桌面
    def setBMPWallpaper(self, imagepath):
        k = win32api.RegOpenKeyEx(win32con.HKEY_CURRENT_USER,"Control Panel\\\\Desktop",0,win32con.KEY_SET_VALUE)
        win32api.RegSetValueEx(k, "WallpaperStyle", 0, win32con.REG_SZ, "2") #2拉伸适应桌面,0桌面居中
        win32api.RegSetValueEx(k, "TileWallpaper", 0, win32con.REG_SZ, "0")
        win32gui.SystemParametersInfo(win32con.SPI_SETDESKWALLPAPER,imagepath, 1+2)
        print "设置为桌面壁纸"

    def convent2BMP(self, picFile):
        bmpImage = Image.open(picFile)
        newPath = STORE_DIR + 'today_wall_pic.bmp'
        bmpImage.save(newPath, "BMP")
        print "另存为BMP格式"
        return newPath
if __name__ == '__main__':
    bingPic = BingPic()
    content = bingPic.readCNBingPage()
    picUrl = bingPic.getBingImageUrl(content)
    if picUrl <> -1:
        picFile = bingPic.downLoadBingImage(picUrl)
        picFile = bingPic.convent2BMP(picFile)
        bingPic.setBMPWallpaper(picFile)
#该片段来自于http://outofmemory.cn
