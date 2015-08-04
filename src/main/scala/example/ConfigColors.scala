package example


/**
 * Created by Larry on 8/1/15.
 */
import org.scalajs.dom

import dom.ext._
import scala.scalajs
.concurrent
.JSExecutionContext
.Implicits
.runNow
object ConfigColors {

  //var colorsMap = new HashMap[]

  def load() = {
//    val str = Source.fromFile("resources/config/colors.json").mkString
//    Logger.debug(str, getClass)
    Logger.debug("This being called", getClass)

    Ajax.get("config/colors.properties").onSuccess{case xhr => {
        Logger.debug(xhr.responseText, getClass)
      }
    }
  }

  def reload(): Unit ={


  }






}


