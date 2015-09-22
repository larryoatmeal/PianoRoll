package example

import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 9/21/15.
 */
class ToggleImage(imageA: SmartImage, imageB: SmartImage) extends RenderObject{

  var onA = true

  override def draw(x: Double, y: Double, width: Double, height: Double, ctx: CanvasRenderingContext2D): Unit = {
    if(onA){
      imageA.draw(x, y, width, height, ctx)
    }else{
      imageB.draw(x, y ,width, height, ctx)
    }
  }

  override def onClick(x: Double, y: Double): Unit = {
    if(onA){
      imageA.onClick(x, y)
      onA = false
    }else{
      imageB.onClick(x, y)
      onA = true
    }
  }

  def toggle(): Unit = onA = !onA

}
