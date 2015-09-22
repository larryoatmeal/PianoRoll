package example

import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 8/16/15.
 */
class Button(ctx: CanvasRenderingContext2D, rectangle: Rectangle)
  extends Renderable(ctx, rectangle) with Clickable{

  val log = new Logger(this)

  var text = ""

  override def draw(): Unit = {
    ctx.fillStyle = "#0023FF"
    rFillRect(0, 0, 1, 1)
    ctx.fillStyle = "#FF2300"
    rFillText(text, 0.5, 0.5)
  }

  override def onClick(x: Double, y: Double): Unit = {
    log(s"Button $text clicked")
  }
}
