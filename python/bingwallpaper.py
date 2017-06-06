#!/usr/bin/env python
# -*- coding:utf-8 -*-
# -*- author:insun -*-
# python2抓取bing主页所有背景图片

import urllib,urllib.request,re,sys,os

def get_bing_backphoto():
    
    if (os.path.exists('photos')== False):
        os.mkdir('photos')
        
    for i in range(0,1000):
        url = 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx='+str(i)+'&n=1&nc=1361089515117&FORM=HYLH1'
        html = urllib.request.urlopen(url).read()
        if html == 'null':
            print ('open & read bing error!')
            sys.exit(-1)
        html = html.decode('utf-8')
        reg = re.compile('"url":"(.*?)","urlbase"',re.S)
        text = re.findall(reg,html)
        for imgurl in text:
            right = imgurl.rindex('/')
            name = imgurl.replace(imgurl[:right+1],'')
            savepath = 'photos/'+ name
            urllib.request.urlretrieve(imgurl, savepath)
            print (name + ' save success!')
            
get_bing_backphoto()
