package example

import org.scalajs.dom.raw.{Event, CanvasRenderingContext2D}

import scala.scalajs.js

/**
 * Created by Larry on 9/9/15.
 */
class SmartImage(src: String) extends RenderObject{
  val log = new Logger(this)

  //@warn clicking behaviour doesn't work as expected when this is true
  var maintainRatio = true


//  val img = new Image()
  val img = new Image()

  var loaded = false
//
//  val image = new Image()
//
    img.src = src
//
//
  img.addEventListener("load", {
    e: Event => {
      loaded = true
    }}
  )

  var altHeight = 0.0
  var altWidth = 0.0

  override def draw(x: Double, y: Double, width: Double, height: Double, ctx: CanvasRenderingContext2D): Unit = {
//    ctx.fillRect(x, y ,width, height)



    if(loaded){
      if(maintainRatio){
        val horizontalStretch = width / img.width
        val verticalStretch = height / img.height

        //use smaller stretch
        if(horizontalStretch < verticalStretch){
          altWidth = width
          altHeight = img.height * horizontalStretch
        }else{
          altWidth = img.width * verticalStretch
          altHeight = height
        }

        ctx.drawImage(img, x, y, altWidth, altHeight)
      }
      else{
        ctx.drawImage(img, x, y, width, height)
      }
    }else{
      ctx.fillText("Loading", x, y)
    }

  }

  override def containsPoint(x: Double, y: Double): Boolean = {
    if(maintainRatio){
      x >= this.x && x <= this.x + altWidth &&
        y >= this.y && y <= this.y + altHeight
    }else{
      super.containsPoint(x, y)
    }
  }
}
