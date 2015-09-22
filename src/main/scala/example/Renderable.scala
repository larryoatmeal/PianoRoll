package example

import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 7/25/15.
 */
abstract class Renderable(val ctx: CanvasRenderingContext2D, val rectangle: Rectangle) {

//  def render(): Unit ={
//    ctx.setTransform(1, 0, 0, 1, 0, 0)
//    ctx.translate(rectangle.x, rectangle.y)
//    ctx.scale(rectangle.width, rectangle.height)
//    draw(ctx)
//    ctx.setTransform(1, 0, 0, 1, 0, 0)
//  }

  def rFillRect(x: Double, y: Double, w: Double, h: Double): Unit ={
    ctx.fillRect(x * rectangle.width + rectangle.x, y * rectangle.height + rectangle.y,
      w * rectangle.width, h * rectangle.height)
  }

  def rFillText(text: String, x: Double, y: Double): Unit = {
    ctx.fillText(text: String, x * rectangle.width + rectangle.x, y * rectangle.height + rectangle.y)
  }

  def rFillText(text: String, x: Double, y: Double, maxWidth: Double): Unit = {
    ctx.fillText(text: String, x * rectangle.width + rectangle.x, y * rectangle.height + rectangle.y, maxWidth * rectangle.width)
  }

  def draw()

}
