package example

import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 7/25/15.
 */
trait Renderable {

  var cached = false
  var dirty = false
  var rectangle: Rectangle
  var renderer: CanvasRenderingContext2D


  def render(): Unit ={
    if(cached && dirty){
      clear()
      //renderer.setTransform()
      draw()
    }
  }

  def draw()

  def clear()


}
