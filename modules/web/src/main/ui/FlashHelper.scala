package lila.web
package ui

import lila.ui.ScalatagsTemplate.*
import lila.ui.Context
import lila.core.i18n.{ I18nKey as trans }

final class FlashHelper(i18n: lila.ui.I18nHelper):

  import i18n.given

  def standardFlash(using Context): Option[Tag] =
    successFlash.orElse(warningFlash).orElse(failureFlash)

  def successFlash(using ctx: Context): Option[Tag] =
    ctx.flash("success").map { msg =>
      flashMessage("success"):
        if msg.isEmpty then trans.site.success() else msg
    }

  def warningFlash(using ctx: Context): Option[Tag] =
    ctx.flash("warning").map { msg =>
      flashMessage("warning"):
        if msg.isEmpty then "Warning" else msg
    }

  def failureFlash(using ctx: Context): Option[Tag] =
    ctx.flash("failure").map { msg =>
      flashMessage("failure"):
        if msg.isEmpty then "Failure" else msg
    }

  def flashMessage(color: String)(content: Modifier*): Tag =
    flashMessageWith(cls := s"flash flash-$color")(content)

  def flashMessageWith(modifiers: Modifier*)(content: Modifier*): Tag =
    div(modifiers)(div(cls := "flash__content")(content))
