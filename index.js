const AWS = require("aws-sdk");
const program = require('commander');
const inquirer = require('inquirer');
if (typeof Promise === 'undefined') {
	AWS.config.setPromisesDependency(require('bluebird'));
}
const ses = new AWS.SES({ apiVersion: "2010-12-01" });
let questions = [
	{
		type: 'input',
		name: 'subject',
		message: "Enter the Subject Line to be used:"
	},
	{
		type: 'input',
		name: 'senderemail',
		message: 'Enter the Email Address of the sender:'
	},
	{
		type: 'input',
		name: 'sendername',
		message: 'Enter the Name of the Sender:'
	}
];
let awsconfig = {};

program
	.version('1.0.0')
	.option('-R, --region', 'AWS Region')
	.option('-K, --keyid', 'AWS Access Key ID')
	.option('-S, --secret', 'AWS Secret Access Key')
	.option('-C, --configset', 'SES Configuration Set Name')
	.parse(process.argv);

AWS.config.update({region:'us-east-1'});
console.log(AWS.config);

// Set the region in our variables: priority: CLI args, aws config, choice
if (program.region) {
	// TO DO: Add check to make sure the region is valid
	awsconfig.region = program.region;
} else if (AWS.config.region == null) {
	// only ask if the aws config doesn't already have a region set.
	questions.unshift({
		type: 'list',
		name: 'region',
		message: 'Which region shall we use?',
		choices: [
			'us-east-1',
			'us-west-2',
			'eu-west-1'
		]
	});
}
// use CLI arg IDs if provided
if (program.keyid) {
	awsconfig.accessKeyId = program.keyid;
}
if (program.secret) {
	awsconfig.secretAccessKey = program.secret;
}
// update the AWS config, but only if there's something to update.
if (Object.keys(awsconfig).length === 0) {
	AWS.config.update(awsconfig);
}
// check for config sets, add question about config sets.
const configsets = ses.listConfigurationSets({MaxItems: 0}).promise();
configsets.then(data => {
	let num = data.ConfigurationSets.length;
	let choices = [];
	for (let i = 0; i < num; i++){
		choices.push(data.ConfigurationSets[i].Name);
	}
	questions.unshift({
		type: 'list',
		name: 'configurationSet',
		message: 'Which Configuration Set shall we use?',
		choices: choices
	});
}).catch(error => {
	console.log(error, error.stack);
	process.exit(1);
});
// TO DO: Load up local files, add questions about email content
// TO DO: Load up local files(*.csv), add question about email target
inquirer.prompt(questions).then(async answers => {
	let message = {
		Body: {
			Html: {
				Charset: "UTF-8"
			},
			Text: {
				Charset: "UTF-8"
			}
		},
		Subject: {
			Charset: "UTF-8",
			Data: answers.subject
		}
	}
	let emailparams = {
		Destination: {
			ToAddresses: []
		},
		Message: message,
		Source: answers.senderemail
	}
	// TO DO: Load up and add "to" addresses here
	
	// TO DO: in a loop with all the "to" addresses
	const sendEmail = ses.sendEmail(emailparams).promise();

	sendEmail
		.then(data => {
			console.log("email submitted to SES", data);
		})
		.catch(error => {
			// TO DO: Put something here so that we log these issues somewhere for bigger sends
			console.log(error);
	});
})

const params = {
	Destination: {
		ToAddresses: [""XYZ@XYZ.com""] // Email address/addresses that you want to send your email
	},
	ConfigurationSetName: <<ConfigurationSetName>>,
	Message: {
		Body: {
			Html: {
				// HTML Format of the email
				Charset: "UTF-8",
				Data:
					"<html><body><h1>Hello  Charith</h1><p style='color:red'>Sample description</p> <p>Time 1517831318946</p></body></html>"
			},
			Text: {
				Charset: "UTF-8",
				Data: "Hello Charith Sample description time 1517831318946"
			}
		},
		Subject: {
			Charset: "UTF-8",
			Data: "Test email"
		}
	},
	Source: "ABC@ABC.com"
};
