# donut_chart_ngpigeon
Addition of donut chart to the existing module pigeon-chart of ngPigeon a data visualization element

After downloading the files from github follow the following steps:<br />
# Step1
Copy this tool into your project root directory then inject our module name data-ng-app="pigeon-chart" under HTML tag. 
 <br />
# Step 2
Make sure you include Pigeon Core, Pigeon Chart, AngularJS, Underscore, Highcharts and Highcharts related JavaScript files under head tag of your project. Take note of the sequences of the files you have included. jQuery, AngularJS, Highcharts and Underscore must be loaded before Pigeon Chart JavaScript.
<br />
 

If your website is running on PHP, you can just insert the "includes.php" file into your PHP project instead of inserting JS file one by one. "includes.php" file is located under "pigeon-chart/php" folder.
<br />
 
# Step 3
Configure your MySQL hostname, username, password and the database in the "pigeon-core/configdb.php". This PHP must be configured properly in order to communicate with MySQL server.
<br />
 
# Step 4
In order to display data in different chart forms add the following custom pigon-chart element to your HTML web page, You are required to insert the MySQL query command to retrieve the data from mySQL database. 
<pigeon-chart query="SELECT Browser_name, Browser_popularity FROM browsers"
                title="Donut Chart"
                subtitle="Popularity of browsers between people"
                type="donut"
                axisY-title="Browser_name"
                axisX-title="Browser_popularity"
                show-legend="bottom"
                show-data-label="true"
                zoom-type="xy">Placeholder for generic chart
</pigeon-chart>
<br />
The only change here is we add the type as “donut”, the implementation results are displayed is Figure 3
<br />
Donut Chart
Popularity of browsers between people
 
