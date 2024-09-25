import torch
from torch import nn


class depthwiseConv(nn.Module):
    def __init__(self, nin, nout, kernel_size = 3,stride=1, padding = 1):
        super(depthwiseConv, self).__init__()
        self.depthwise = nn.Conv2d(nin, nin, kernel_size=kernel_size,stride=stride, padding=padding, groups=nin)
        self.pointwise = nn.Conv2d(nin, nout, kernel_size=1)
        self.prelu = nn.PReLU()
        self.bn = nn.BatchNorm2d(nout)
    def forward(self, x):
        out = self.depthwise(x)
        out = self.pointwise(out)
        out = self.prelu(out)
        out = self.bn(out)

        return out
    
class LinearGlobalDepthConv(nn.Module):
    def __init__(self, nin, nout,kernel_size=3,stride=1, padding=1):
        super(LinearGlobalDepthConv, self).__init__()
        self.depthwise_conv = nn.Conv2d(nin, nin, kernel_size=kernel_size, stride=stride, padding=padding, groups=nin)
        self.global_pooling = nn.AdaptiveAvgPool2d(1)  
        self.pointwise_conv = nn.Conv2d(nin, nout, kernel_size=1)  

    def forward(self, x):
        out = self.depthwise_conv(x) 
        out = self.global_pooling(out)  
        out = self.pointwise_conv(out)  
        return out


class Bottleneck(nn.Module):
    def __init__(self, nin,nout,stride,factor, kernel_size = 3):
        super(Bottleneck, self).__init__()
        mid_channels = factor*nin
        self.pointwiseExpention = nn.Conv2d(nin, mid_channels, kernel_size=1)
        self.prelu = nn.PReLU()

        self.DWCNN = depthwiseConv(mid_channels,mid_channels,kernel_size=kernel_size,stride=stride,padding=1)
        
        self.pointwiseProjection = nn.Conv2d(mid_channels,nout, kernel_size=1)

    def forward(self,x):
        out = self.pointwiseExpention(x)
        out = self.prelu(out)
        out = self.DWCNN(out)
        out = self.pointwiseProjection(out)
        return out
class FaceRecognition(nn.Module):
    def __init__(self):
        super(FaceRecognition, self).__init__()
        #
        self.conv3x3 = nn.Conv2d(3,63,3,stride=2)
        #
        self.DWConv = depthwiseConv(63,63,3)
        #

        self.BottleNeck31 = Bottleneck(63,63,2,2)
        #
        self.BottleNeck41 = Bottleneck(63,127,2,4)
        #
        self.BottleNeck51 = Bottleneck(127,127,1,2)
        self.BottleNeck52 = Bottleneck(127,127,1,2)
        self.BottleNeck53 = Bottleneck(127,127,1,2)
        self.BottleNeck54 = Bottleneck(127,127,1,2)
        self.BottleNeck55 = Bottleneck(127,127,1,2)
        self.BottleNeck56 = Bottleneck(127,127,1,2)
        #
        self.BottleNeck61 = Bottleneck(127,127,2,2)
        #
        self.BottleNeck71 = Bottleneck(127,127,1,2)
        self.BottleNeck72 = Bottleneck(127,127,1,2)
        #
        self.Conv1x1 = nn.Conv2d(127,511,1,padding=1)
        #
        self.LGDC = LinearGlobalDepthConv(511,511,7)
        #
        self.LinearConv1x1 = nn.Conv2d(511,127,1)
        
        self.prelu = nn.PReLU()

    def forward(self, x):
        #
        out = self.conv3x3(x)
        #
        out =self.DWConv(out)
        #
        out =self.BottleNeck31(out)
        #
        out =self.BottleNeck41(out)
        #
        out =self.BottleNeck51(out)
        out =self.BottleNeck52(out)
        out =self.BottleNeck53(out)
        out =self.BottleNeck54(out)
        out =self.BottleNeck55(out)
        out =self.BottleNeck56(out)
        #
        out =self.BottleNeck61(out)
        #
        out =self.BottleNeck71(out)
        out =self.BottleNeck72(out)
        #
        out =self.Conv1x1(out)
        #
        out =self.LGDC(out)
        #
        out = self.LinearConv1x1(out)
        #
        out = self.prelu(out)
        return out