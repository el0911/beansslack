const Templates = {
  layout: `<body bgcolor="#f5f5f5" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" offset="0"
        style="padding:70px 0 70px 0;">
        <table width="600" height="auto" align="center" cellpadding="0" cellspacing="0"
            style="background-color:#fdfdfd; border:1px solid #dcdcdc; border-radius:3px !important;">
            <tr>
                <td width="600" height="auto" bgcolor="#3F3D56" border="0"
                    style="display:block; margin: 0px auto;">
                    <img style="width: -webkit-fill-available"  src="cid:banner.png" > 
    <!-- cid:logo -->
                </img>
                </td>
            </tr>
            <tr>
                ////*/emailTemplate/*///
            </tr>
            <tr>
                <td width="600" border="0"
                    style="padding:0 48px 48px 48px; color:#707070; font-family:Arial; font-size:12px; line-height:125%; text-align:center;">
                    <p>@Coffee beans 2021</p>
                </td>
            </tr>
        </table>
    </body>`,

  sendinErrorNotification: `<td class="content" width="600" bgcolor="#fdfdfd" border="0"
    style="color:#737373; font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif; font-size:14px; line-height:150%; text-align:left; padding:48px;">
    <p style="margin:0 0 16px;">

        <p >Hello!!</a>
          <p>Its sad but we've found a new bug log into <a href="https://www.beansio.app" class="">Beansio.app</a> to check it out </p>
        </p>

        <div style="background:silver;padding:40px 20px;font-family: monospace;" class="sc-ftvSup kQceQu">
        <p>
          <spam style="color:red">Error</spam> : <spam>////*/errorTitle/*///</spam>
        </p>
        <div>
        ////*/error/*///
        </div>
      </div>

    </td>`,

  sendingToken: `<td class="content" width="600" bgcolor="#fdfdfd" border="0"
    style="color:#737373; font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif; font-size:14px; line-height:150%; text-align:left; padding:48px;">
    <p style="margin:0 0 16px;">

    <p >Hello!!</a>

    <p>Thank's  for Joining us on slack </p>

    <p>Here is your token Keep it safe</p>
    </br>
    <p> ////*/token/*/// </p>

        
    </p>

    </td>`,

};

module.exports = {
  Templates,
};
