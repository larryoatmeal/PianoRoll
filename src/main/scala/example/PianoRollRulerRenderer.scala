package example

import org.scalajs.dom.html
import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 7/26/15.
 */
class PianoRollRulerRenderer(val pianoRollContainer: PianoRollWorld,  val renderer: CanvasRenderingContext2D){

  def render(rect: Rectangle): Unit ={
    renderer.clearRect(rect.x, rect.y, rect.width, rect.height)
    val widthBeats = pianoRollContainer.widthBeats
    pianoRollContainer.tickLogic.getTickMarkers(
      pianoRollContainer.startBeat, pianoRollContainer.widthBeats
//      , pianoRollContainer.maxTicks, pianoRollContainer.maxMeasures
    ).foreach({
      tickMarker => {
        //Logger.debug(tickMarker.toString, this.getClass)
        val (color, height) = tickMarker.symbol match{
          case TickMarker.MeasureTick => ("#FF0000", rect.height)
          case TickMarker.QuarterTick => ("#00FF00", rect.height/2)
          case TickMarker.EightTick =>   ("#0000FF", rect.height/3)
          case TickMarker.SixteenthTick => ("#00FFFF", rect.height/4)
          case _ => ("#66E066", rect.height)
        }
        renderer.strokeStyle = color

        renderer.beginPath()
        val x = (tickMarker.beat-pianoRollContainer.startBeat).toDouble/widthBeats * rect.width + rect.x
        renderer.moveTo(x, rect.y)
        renderer.lineTo(x, rect.y + height)
        renderer.stroke()

        renderer.font = "12pt Calibri"
        if(tickMarker.symbol > 0){//display measure number
          renderer.fillText((tickMarker.symbol+1).toString, x, rect.y + rect.height*4/5)
        }
      }
    })
  }
}
