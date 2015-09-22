//package example
//
//import org.scalajs.dom.raw._
//
//import scala.scalajs.js.{Any, Array}
//
///**
// * Created by Larry on 8/21/15.
// */
//class RelativeContext2D(ctx: CanvasRenderingContext2D, rect: Rectangle) extends CanvasRenderingContext2D{
//
//  override var globalCompositeOperation : scala.Predef.String
//  override var lineCap : scala.Predef.String
//  override var lineDashOffset : scala.Double
//  override var shadowColor : scala.Predef.String
//  override var lineJoin : scala.Predef.String
//  override var shadowOffsetX : scala.Double
//  override var lineWidth : scala.Double
//  override var canvas : org.scalajs.dom.raw.HTMLCanvasElement
//  override var strokeStyle : scala.scalajs.js.Any
//  override var globalAlpha : scala.Double
//  override var shadowOffsetY : scala.Double
//  override var fillStyle : scala.scalajs.js.Any
//  override var shadowBlur : scala.Double
//  override var textAlign : scala.Predef.String
//  override var textBaseline : scala.Predef.String
//
//
//  override def restore(): Unit = ctx.restore()
//
//  override def setTransform(m11: Double, m12: Double, m21: Double, m22: Double, dx: Double, dy: Double): Unit = ctx.setTransform(m11, m12, m21, m22, dx, dy)
//
//  override def save(): Unit = ctx.save()
//
//  override def arc(x: Double, y: Double, radius: Double, startAngle: Double, endAngle: Double, anticlockwise: Boolean): Unit = ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
//
//  override def arc(x: Double, y: Double, radius: Double, startAngle: Double, endAngle: Double): Unit = ctx.arc(x, y, radius, startAngle, endAngle)
//
//  override def measureText(text: String): TextMetrics = ctx.measureText(text)
//
//  override def isPointInPath(x: Double, y: Double, fillRule: String): Boolean = ctx.isPointInPath(x, y, fillRule)
//
//  override def isPointInPath(x: Double, y: Double): Boolean = ctx.isPointInPath(x, y)
//
//  override def quadraticCurveTo(cpx: Double, cpy: Double, x: Double, y: Double): Unit = ctx.quadraticCurveTo(cpx, cpy, x, y)
//
//  override def putImageData(imagedata: ImageData, dx: Double, dy: Double, dirtyX: Double, dirtyY: Double, dirtyWidth: Double, dirtyHeight: Double): Unit = ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight)
//
//  override def rotate(angle: Double): Unit = ctx.rotate(angle)
//
//  override def fillText(text: String, x: Double, y: Double, maxWidth: Double): Unit = ctx.fillText(text, x, y, maxWidth)
//
//  override def translate(x: Double, y: Double): Unit = ctx.translate(x, y)
//
//  override def scale(x: Double, y: Double): Unit = ctx.scale(x, y)
//
//  override def createRadialGradient(x0: Double, y0: Double, r0: Double, x1: Double, y1: Double, r1: Double): CanvasGradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)
//
//  override def lineTo(x: Double, y: Double): Unit = ctx.lineTo(x, y)
//
//  override def getLineDash(): Array[Double] = ctx.getLineDash()
//
//  override def fill(): Unit = ctx.fill()
//
//  override def createImageData(imageDataOrSw: Any, sh: Double): ImageData = ctx.createImageData(imageDataOrSw, sh)
//
//  override def createPattern(image: HTMLElement, repetition: String): CanvasPattern = ctx.createPattern(image, repetition)
//
//  override def closePath(): Unit = ctx.closePath()
//
//  override def rect(x: Double, y: Double, w: Double, h: Double): Unit = ctx.rect(x, y, w, h)
//
//  override def clip(fillRule: String): Unit = ctx.clip(fillRule)
//
//  override def clearRect(x: Double, y: Double, w: Double, h: Double): Unit = ctx.clearRect(x, y, w, h)
//
//  override def moveTo(x: Double, y: Double): Unit = ctx.moveTo(x, y)
//
//  override def getImageData(sx: Double, sy: Double, sw: Double, sh: Double): ImageData = ctx.getImageData(sx, sy, sw, sh)
//
//  override def fillRect(x: Double, y: Double, w: Double, h: Double): Unit = ctx.fillRect(x, y, w, h)
//
//  override def bezierCurveTo(cp1x: Double, cp1y: Double, cp2x: Double, cp2y: Double, x: Double, y: Double): Unit = ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
//
//  override def drawImage(image: HTMLElement, offsetX: Double, offsetY: Double, width: Double, height: Double, canvasOffsetX: Double, canvasOffsetY: Double, canvasImageWidth: Double, canvasImageHeight: Double): Unit = ctx.drawImage(image, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, canvasImageWidth, canvasImageHeight)
//
//  override def transform(m11: Double, m12: Double, m21: Double, m22: Double, dx: Double, dy: Double): Unit = ctx.transform(m11, m12, m21, m22, dx, dy)
//
//  override def stroke(): Unit = ctx.stroke()
//
//  override def strokeRect(x: Double, y: Double, w: Double, h: Double): Unit = ctx.strokeRect(x, y, w, h)
//
//  override def setLineDash(segments: Array[Double]): Unit = ctx.setLineDash(segments)
//
//  override def strokeText(text: String, x: Double, y: Double, maxWidth: Double): Unit = ctx.strokeText(text, x, y, maxWidth)
//
//  override def beginPath(): Unit = ctx.beginPath()
//
//  override def arcTo(x1: Double, y1: Double, x2: Double, y2: Double, radius: Double): Unit = ctx.arcTo(x1, y1, x2, y2, radius)
//
//  override def createLinearGradient(x0: Double, y0: Double, x1: Double, y1: Double): CanvasGradient = ctx.createLinearGradient(x0, y0, x1, y1)
//
//
//
//
//}
