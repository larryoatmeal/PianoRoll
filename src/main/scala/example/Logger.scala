package example

/**
 * Created by Larry on 7/11/15.
 */
object Logger {

  def verbose(msg: String, clazz: Class[_]){
    println(s"VERBOSE:${clazz.getName} - $msg")
  }

  def debug(msg: String, clazz: Class[_]){
    println(s"DEBUG:${clazz.getName} - $msg")
  }

  def info(msg: String, clazz: Class[_]){
    println(s"INFO:${clazz.getName} - $msg")
  }

  def warn(msg: String, clazz: Class[_]){
    println(s"WARN:${clazz.getName} - $msg")
  }

}
