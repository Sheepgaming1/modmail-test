import { VercelRequest, VercelResponse } from '@vercel/node';
import Mongo from '../database/Mongo';

const db = Mongo.getDatabase();

export default async (req: VercelRequest, res: VercelResponse) => {
	if (!req.query.id)
		return res.status(404).send('Not found');

	const data = await db.getLog(req.query.id as string);
	if (!data)
		return res.status(404).send('Not found');

	const messages: string[] = [];
	for (const msg of data.messages)
		messages.push(`
<tr>
	<td>
		<div>
			<img src="${msg.author.avatarURL}" style="float: left; width: 30px; height: 30px; border-radius: 50%;">
		</div>
		<div style="padding-left: 15px">
			<h3 class="${msg.type}">${msg.author.username} - ${msg.type}</h3> <p style="color:grey"> <i>${msg.timestamp} </i> </p>
			<p class="content-text">${msg.content}</p>
			${msg.originalContent ? `<br><p class="content-text" style=font-weight:"bold"><b>Original Content: </b>  ${msg.originalContent}</p>` : ''}
			${msg.attachments && msg.attachments.length > 0 ? `
			<div class="files">
					${msg.attachments.map((f, v) => `<a href="${f}">Image ${v}</a>`).join(' ')}
			</div>` : ''}
		</div>
	</td>
</tr>
`);

	res.send(`
<html lang="en">
<head>
  	<title>${data.title || 'Ticket Logs'}</title>
  	<meta charset="UTF-8">
  	<meta name="description" content="Log from ${data.recipient.username}.">
  	<link rel="icon" href="${data.recipient.avatarURL}" type="image/icon type">
  	<style>
        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #27292b
        }

        .topnav {
            overflow: hidden;
            background-color: #000000;
            position: fixed;
            z-index: 1;
        }

        .topnav-title {
            background-color: #000000;
            overflow: hidden;
            width: 213px;
            float: left;
        }

        .topnav-title p {
            float: left;
            font-size: 20px;
            color: #a10808;
            padding-left: 16px;
            position: center;
        }

        .topnav-links {
            overflow: hidden;
            float: left;
        }

        .topnav-links a {
            float: left;
            text-align: center;
            padding: 20px 16px;
            text-decoration: none;
            font-size: 20px;
            color: #7289DA;
        }

        .topnav-links a:hover {
            color: black;
        }
        .topnav-img {
            overflow: hidden;
            float: fixed;
        }

        .topnav-img a {
            float: left;
            text-align: center;
            padding: 63px 63px;
            text-decoration: none;
            font-size: 20px;
            color: #7289DA;
        }

        .topnav-img a:hover {
            color: black;
        }

        .main {
            padding: 70px 20px;
            position: relative;
        }

        h2 {
            color: #99AAB5;
        }

        h3 {
            color: #7289DA;
        }

        .files {
            color: #fdc75b;
        }

        .files a {
            color: lightskyblue;
            text-decoration: none;
        }

        .files a:hover {
            text-decoration: lightskyblue;
        }

        .content-text {
            color: white;
            padding-left: 20px;
        }
        
        .STAFF_REPLY {
        	color: forestgreen;
        	padding-left: 20px;
        }
        
        .RECIPIENT_REPLY {
        	color: cornflowerblue;
        	padding-left: 20px;
        }
        
        .INTERNAL {
        	color: coral;
        	padding-left: 20px;
        }
        
        table {
        	border-collapse: collapse;
        	width: 100%;
        }
        
        td, tr {
					padding: 15px;
				}
				
				tr {
					border-bottom: 2px solid black;
				}
				
				.time {
					width: 7%;
					text-align: center;
					color: #050505;
					font-size: 13px;
				}
    </style>
</head>

<body>

		<div class="topnav">

        <div class="topnav-title">
            <img src="${data.recipient.avatarURL}" style="float: left; width: 63px; height: 63px">
            <p>${data.title || 'Ticket Logs'}</p>
        </div>

        <div class="topnav-links">
            <a href="https://tickets.tlbrp.com/">Support Hub</a>
            <a href="https://discord.gg/tlbrp">Discord Server</a>
        </div>
	
        <div class="topnav-img">
	<img src="https://media.discordapp.net/attachments/913479115674386483/940722388046348328/animated_server_icon.gif?width=115&height=115" style="float: right; width: 63px; height: 63px">
        </div>

    </div>
    
    <div class="main">
    		<div>
            <h2>Log from user ${data.recipient.username}</h2>
            ${data.note ? `<p class="content-text">Note: ${data.note}</p>` : ''}
            <hr>
        </div>
        
        <table>
        	${messages.join('')}
				</table>
		</div>
</body>
</html>
`);

};
