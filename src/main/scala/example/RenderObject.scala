package example

import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 9/5/15.
 */
abstract class RenderObject {

  var x = 0.0
  var y = 0.0
  var w = 100.0
  var h = 100.0


  /**Render should be called when drawing to capture coordinates
   *
   * @param x abs x
   * @param y abs y
   * @param width abs width
   * @param height abs height
   * @param ctx
   */
  def render(x: Double, y: Double, width: Double, height: Double, ctx: CanvasRenderingContext2D): Unit ={
    this.x = x
    this.y = y
    this.w = width
    this.h = height
    draw(x, y, width, height, ctx)
  }
  def draw(x: Double, y: Double, width: Double, height: Double, ctx: CanvasRenderingContext2D)

  def onClick(x: Double, y: Double): Unit ={

  }

  def containsPoint(x: Double, y: Double) = x >= this.x && x <= this.x + this.w &&
    y >= this.y && y <= this.y + this.h
  
  def probeClick(x: Double, y: Double): Unit = {
    if(containsPoint(x, y)){
      onClick(x, y)
    }
  }
  

}