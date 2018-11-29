const AWS = require("aws-sdk");
const program = require('commander');
const inquirer = require('inquirer');
if (typeof Promise === 'undefined') {
	AWS.config.setPromisesDependency(require('bluebird'));
}
const ses = new AWS.SES({ apiVersion: "2010-12-01" });
let questions = [];
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
	// only do this if the aws config doesn't already have a region set.
	questions.push({
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

const sendEmail = ses.sendEmail(params).promise();

sendEmail
	.then(data => {
		console.log("email submitted to SES", data);
	})
	.catch(error => {
		console.log(error);
});
