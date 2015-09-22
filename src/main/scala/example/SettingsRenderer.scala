package example

import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 8/16/15.
 */
class SettingsRenderer(settings: PianoRollSettings, ctx: CanvasRenderingContext2D,
                        rect: Rectangle) extends Renderable(ctx, rect) with Clickable{

  val log = new Logger(this)

  override def draw(): Unit = {
    buttons.foreach{
      button => {
        button.draw()
      }
    }
  }

  private val Margin = 0.9
  val buttonWidth = 1.0/settings.vars.size * Margin // margin

  val buttonXCoordinates = settings.vars.indices.map(_.toDouble/settings.vars.size)

  val buttons = settings.vars.zipWithIndex.map(
    (tuple: (Setting, Int)) => {
      val setting = tuple._1
      val index = tuple._2
      val x = rect.x + index.toDouble/settings.vars.size * rect.width
      val width = rect.width/settings.vars.size * Margin
      val buttonRect = Rectangle(x, rect.y, width, Margin * rect.height)
      val button = new Button(ctx, buttonRect)
      button.text = setting.name
      button
    })

  override def onClick(x: Double, y: Double): Unit = {
    buttons.foreach{
      button => {
        button.probeClick(x, y)
      }
    }
  }
}
