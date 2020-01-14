<!DOCTYPE html>
<!-- data-ng-app="pigeon-chart" in the html is essential to inject ngPigeon-chart into the webpage-->
<html lang="en" data-ng-app="pigeon-chart" data-ng-cloak>
    <head>
        <meta name="google-site-verification" content="UgKaKWQYQL6TsaMSVd_JGPj9EweAUhks_1qfG7QtjsA" />
        <title>Example</title>
        <!-- The includes.php file is required to include all necessary dependencies-->
        <?php
            include "pigeon-chart/php/includes.php";
            require "pigeon-core/configdb.php";
            ?>
        <style type="text/css">
            table{
            table-layout: fixed;
            background: -webkit-linear-gradient(left, #25c481, #25b7c4);
            background: linear-gradient(to right, #25c481, #25b7c4);
            font-family: 'Roboto', sans-serif;
            }
            input {
            background-color: transparent;
            border-style: none;
            text-align: center;
            }
            .tbl-content{
            height:300px;
            overflow-x:auto;
            margin-top: 0px;
            border: 1px solid rgba(255,255,255,0.3);
            }
            th{
            padding: 20px 15px;
            text-align: center;
            font-weight: 500;
            font-size: 12px;
            color: #fff;
            text-transform: uppercase;
            background-color: rgba(255,255,255,0.3);
            }
            td{
            padding: 15px;
            text-align: center;
            vertical-align:middle;
            font-weight: 300;
            font-size: 12px;
            color: #fff;
            border-bottom: solid 1px rgba(255,255,255,0.1);
            }
            input[type=submit] {
            background-color: rgba(255,255,255,0.3);
            border: none;
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            margin: 4px 2px;
            cursor: pointer;
            }
            .ins {
            border: 2px solid rgba(255,255,255,0.3);;
            padding: 20px 15px;
            font-weight: 500;
            font-size: 12px;
            }
            ::-webkit-scrollbar {
            width: 6px;
            } 
            ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
            } 
            ::-webkit-scrollbar-thumb {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
            }
            ::placeholder { 
            color: white;
            }
        </style>
    </head>
    <?php
        $db = new mysqli(HOSTNAME, USERNAME, PASSWORD, DATABASE) or die ("Unable to Connect to the Database");
        $query = "SELECT * FROM laptop_sales";
        
        if(isset($_POST['ins'])){ 
        	$brand = $_POST['brand'];
        	$share = $_POST['market'];
        	$bid = $_POST['id'];
        	if($brand !=''||$share !=''){
        		$sql ="insert into laptop_sales(id, Brand_name, market_share) values ('$bid', '$brand', '$share')";
        		$retval = mysqli_query($db,$sql);
        
        		if(! $retval ) {
        			die('Could not enter data: ' . mysqli_error($db));
        		}
        
        	}
        }
        ?>
    <form  action="" method="post">
        <table align="center" class="tbl-content" border="0">
            <tr>
                <th>Brand ID</th>
                <th>Brand Name</th>
                <th>Market Share</th>
            </tr>
            <?php
                if ($result = $db->query($query)) {
                	while ($row = $result->fetch_assoc()) {
                		$id= $row["id"];
                		$field1name = $row["Brand_name"];
                		$field2name = $row["market_share"];
                
                		echo'
                		<td ><input type="text"  name="id" value="'.$id.'"/>
                
                		</td> 
                		<td ><input type="text"  name="brand" value="'.$field1name.'"/>
                
                		</td> 
                
                		<td><input type="text"  name="market" value="'.$field2name.'"/></td> 
                
                		</tr>'; 
                	}
                	$result->free();
                } 
                ?> 
            <tr>
                <th colspan="3"> Enter a New Value</th>
            </tr>
            <tr>
                <td >
                    <input type="text"  name="id" class="ins" placeholder="ID" />
                </td>
                <td >
                    <input type="text"  name="brand" class="ins" placeholder="Brand Name" />
                </td>
                <td>
                    <input type="text"  name="market" class="ins" placeholder="Market Share" />
                </td>
            </tr>
            <tr>
                <td colspan="4" align="center">	
                    <input type="submit" name="ins" value="Insert"/>
                </td>
            </tr>
        </table>
    </form>
    <body>
        <div id="axis">
        </div>
        <div>
            <pigeon-chart query="SELECT Brand_name, market_share FROM laptop_sales"
                title="Donut Chart"
                subtitle="Distribution of sales of the laptop industry between five companies"
                type="donut"
                axisY-title="Brand_name"
                axisX-title="market_share"
                show-legend="bottom"
                show-data-label="true"
                zoom-type="xy">Placeholder for generic chart</pigeon-chart>
            <br><br>
            <pigeon-chart query="SELECT Brand_name, market_share FROM laptop_sales"
                title="Pie Chart"
                subtitle="Distribution of sales of the laptop industry between five companies"
                type="pie"
                axisY-title="Brand_name"
                axisX-title="market_share"
                show-legend="bottom"
                show-data-label="true"
                zoom-type="xy">Placeholder for generic chart</pigeon-chart>
        </div>
    </body>
</html>
