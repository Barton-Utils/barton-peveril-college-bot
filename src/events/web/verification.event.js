module.exports = async (client, id, req, res) => {
	if (id === 'favicon.ico') return true;
	client.logger.info(`Verification Server | Verification request made with ${id}`);

	const result = await client.DB.queries.checkVerification(id);

	// Create HTML
	const successHTML = `
    <html>
        <head>
        <title>Barton Discord Verification</title>
        <style>
            html *
            {
                color: #000 !important;
                font-family: Arial !important;
            }

            .center {
                display: block;
                margin-left: auto;
                margin-right: auto;
                width: 50%;
            }
        </style>
        </head>

        <body>
        
        <a href="https://www.barton-peveril.ac.uk/"><img src="https://www.barton-peveril.ac.uk/wp-content/uploads/2019/10/Barton-logo02.svg" width="351" height="93" alt="Barton Peveril"></a>
        
        <h1>Congratulations, your email has been linked to the discord account!</h1>
        <p>You should now have access to the rest of the Barton Student Discord! <b>{{email}}</b> is now linked to <b>{{discord}}</b> if you believe this is an error please email development@ru-pirie.com or message me on discord iPirie#8558.
            
        </body>
    </html>`;

	const errorHTML = `
    <html>
        <head>
        <title>Barton Discord Verification</title>
        <style>
            html *
            {
                font-family: Arial !important;
            }

            .center {
                display: block;
                margin-left: auto;
                margin-right: auto;
                width: 50%;
            }
        </style>
        </head>

        <body>
        
        <a href="https://www.barton-peveril.ac.uk/"><img src="https://www.barton-peveril.ac.uk/wp-content/uploads/2019/10/Barton-logo02.svg" width="351" height="93" alt="Barton Peveril"></a>
        
        <h1 style="color:red">Err: There was an error linking your discord account to your school email!</h1>
        <p>If you continue to have the is error then please contact development@ru-pirie.com or contact me on discord iPirie#8558.</p>
        <br>
        <p>Err: <b>{{error}}</b></p>
        </body>
    </html>`;

	res.writeHead(200, { 'Content-Type': 'text/html' });


	if (result.length !== 0) {
		await client.DB.queries.deleteVerificationCode(id);
		await client.DB.queries.addMember(result[0].id, result[0].email);
		await client.guilds.cache.get(process.env.COLLEGE_GUILD).members.cache.get(result[0].id).roles.add(process.env.MEMBER_ROLE);
		res.end(successHTML.replace('{{discord}}', client.guilds.cache.get(process.env.COLLEGE_GUILD).members.cache.get(result[0].id).user.tag).replace('{{email}}', result[0].email));
	}
	else {
		client.logger.warn('Attempted account link that failed (PANIC?)');
		res.end(errorHTML.replace('{{error}}', 'ACC_UNKNOWN_LINK'));
	}
};