import com.lihaoyi.workbench.Plugin._

enablePlugins(ScalaJSPlugin)

workbenchSettings

name := "Example"

version := "0.1-SNAPSHOT"

scalaVersion := "2.11.5"

resolvers ++= Seq(
  "amateras-repo" at "http://amateras.sourceforge.jp/mvn-snapshot/"
)

libraryDependencies ++= Seq(
  "org.scala-js" %%% "scalajs-dom" % "0.8.0",
  "com.scalawarrior" %%% "scalajs-createjs" % "0.0.1-SNAPSHOT"
)

bootSnippet := "example.ScalaJSExample().main(document.getElementById('canvas'));"

updateBrowsers <<= updateBrowsers.triggeredBy(fastOptJS in Compile)

