package example

import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 9/21/15.
 * 
 * Default behaviour:
 * When not active and clicked, becomes active
 * When active and clicked, stays active
 */
class ActiveInactiveImage(active: RenderObject, inactive: RenderObject, click: (Double, Double) => Unit) extends RenderObject{

  var isActive = false

  override def draw(x: Double, y: Double, width: Double, height: Double, ctx: CanvasRenderingContext2D): Unit = {
    if(isActive){
      active.draw(x, y, width, height, ctx)
    }else{
      inactive.draw(x, y ,width, height, ctx)
    }
  }

  override def onClick(x: Double, y: Double): Unit = {
    if(!isActive){
      click(x, y)
      isActive = true
    }
  }

  def deActivate() = isActive = false
  def activate() = {
    isActive = true
  }

}
