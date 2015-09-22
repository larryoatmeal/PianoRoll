package example

/**
 * Created by Larry on 8/16/15.
 */
trait Clickable{
  this: Renderable => //clickable must extend renderable

  def probeClick(x: Double, y: Double): Unit ={
    if(rectangle.containsPoint(x, y)){
//      onClick((x - rectangle.x)/rectangle.width, (y-rectangle.y)/rectangle.height)
      onClick(x, y)
    }
  }

  def onClick(x: Double, y: Double)
}
