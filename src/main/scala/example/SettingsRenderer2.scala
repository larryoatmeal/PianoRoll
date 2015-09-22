package example

import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 9/6/15.
 */
class SettingsRenderer2(val rect: Rectangle, val ctx: CanvasRenderingContext2D) extends Clickable2{
  val log = new Logger(this)


  val square = new RenderObject {
    override def draw(x: Double, y: Double, width: Double, height: Double, ctx: CanvasRenderingContext2D): Unit = {
      ctx.fillStyle = "#a4f33d"
      ctx.fillRect(x, y, width * 0.8, height * 0.8)
    }

    override def onClick(x: Double, y: Double): Unit = log("Clicked square")
  }
  val oval = new RenderObject {
    override def draw(x: Double, y: Double, width: Double, height: Double, ctx: CanvasRenderingContext2D): Unit = {
      ctx.fillStyle = "#022365"
      ctx.fillRect(x, y, width * 0.8, height * 0.8)
    }
  }
  val playImg = new SmartImage("images/play.png"){
    override def onClick(x: Double, y: Double): Unit = log("Clicked play")
  }

  val settingsContainer = new Container()
  val settingsContainerNested = new Container()


  val numberSquares = 5
  (0 to numberSquares).foreach{
    i => {
      val width = 1.0 / numberSquares
      val height = 1.0
      val x = i.toDouble / numberSquares
      val y = 0
      settingsContainer.addChild(ChildObject(x, y, width, height, square))
      settingsContainerNested.addChild(ChildObject(x, y, width, height, playImg))
    }
  }

  settingsContainer.addChild(ChildObject(0.37, 0.3, 0.5, 0.5, settingsContainerNested))

  def draw(): Unit ={
    //log.verbose("Here")
    settingsContainer.draw(rect.x, rect.y, rect.width, rect.height, ctx)
  }

  override def onClick(x: Double, y: Double): Unit = settingsContainer.onClick(x, y)
}
