
package CT_Framework;
import static org.assertj.core.api.Assertions.assertThat;
import static us.abstracta.jmeter.javadsl.JmeterDsl.*;
import static us.abstracta.jmeter.javadsl.dashboard.DashboardVisualizer.*;
import java.time.Duration;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.apache.http.entity.ContentType;
import org.apache.jmeter.protocol.http.util.HTTPConstants;
import org.junit.jupiter.api.Test;
import us.abstracta.jmeter.javadsl.core.TestPlanStats;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.FileInputStream;
import java.io.IOException;




public class PT_Framework {

    @Test
    public void testPerformance() throws IOException {
       // String baseUrl = "http://petstore.octoperf.com";
    	
    	 FileInputStream fileInputStream = new FileInputStream("C:\\Performance Testing Training\\POC\\URL.xlsx");
         Workbook workbook = new XSSFWorkbook(fileInputStream);
         
         // Access the specific sheet in the Excel file
         Sheet sheet = workbook.getSheet("Sheet1"); // Replace "Sheet1" with the actual sheet name
         
         // Read data from the Excel sheet
         String homepage = sheet.getRow(0).getCell(0).getStringCellValue(); // Replace 1 and 0 with the actual row and column numbers
         String enterhomepage = sheet.getRow(1).getCell(0).getStringCellValue();
         String login = sheet.getRow(2).getCell(0).getStringCellValue();
         String selectcategories = sheet.getRow(3).getCell(0).getStringCellValue();
         String selectproduct = sheet.getRow(4).getCell(0).getStringCellValue();
         String workingitemid = sheet.getRow(5).getCell(0).getStringCellValue();
         String orderconfirm = sheet.getRow(6).getCell(0).getStringCellValue();
         String logoff = sheet.getRow(7).getCell(0).getStringCellValue();
         String payload = sheet.getRow(8).getCell(0).getStringCellValue();
         
         // Close the workbook and file input stream
         workbook.close();
         fileInputStream.close();
    	
    	
         // String baseUrl = "http://petstore.octoperf.com";

         //Creating TestPlan
        // TestPlanStats stats =
        		 testPlan(
     			 csvDataSet("C:\\Performance Testing Training\\POC\\csvDataSet.csv"),
         httpDefaults()
             .encoding(StandardCharsets.UTF_8),
             
             
             /*HTTP Headers are sent to check that the right information is being received.
             They contain a lot of additional information about HTTP connection types, proxies, etc */
             httpHeaders()
                 .header("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7")
                 .header("accept-encoding", "gzip, deflate, br")
                 .header("accept-language", "es-ES,es;q=0.9")
                 .header("cache-control", "max-age=0")
                 .header("sec-ch-ua", "Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114")
                 .header("sec-ch-ua-platform", "Windows")
                 .header("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"),
       	      
	                
	                
 	            //Disable Cookies and Cache
 	           httpCookies().disable(),
 	    	   httpCache().disable(),

 	    	   
 	    	   //Creating Thread Group with 1 user , ramp-up time 1 
 	            threadGroup(1, 1,
 	          		
 	          // threadGroup().rampTo(10, Duration.ofSeconds(5)).holdIterating(20) ,// ramp to 10 threads for 5 seconds (1 thread every half second) and iterating each thread 20 times
 	          // threadGroup().rampToAndHold(10, Duration.ofSeconds(5), Duration.ofSeconds(20)), //similar as above but after ramping up holding execution for 20 seconds

 	            		
 	                // Home Page
 	            		 transaction("T1_HomePage",
 	            	                httpSampler("Home Page", homepage)
 	            	                .children(
 	                                		jsr223PostProcessor(
 	                                        "if (prev.responseCode == '200') { prev.successful = true }")
 	                                )
 	            	            ),
 	             //uniformRandomTimer(Duration.ofSeconds(9), Duration.ofSeconds(12)),  // Think Time 
 	            		 
 	             
 	                // Enter Home Page
 	            		 transaction("T2_EnterHomePage",
 	                httpSampler("Enter Home Page",enterhomepage)
 	                    .children(
 	                        regexExtractor("categoryId", "href=\"Catalog\\.action\\?viewCategory=&categoryId=([^\"]+)\"\\s+shape=\"RECT\"\\s*/>") // regular extractor
 	                            .defaultValue("CategoryID_NOT_FOUND")
 	                            .template("$1$")
 	                            .matchNumber(0),
 	                        responseAssertion().containsSubstrings("200")
 	                    )
 	                    ),
 	            		// uniformRandomTimer(Duration.ofSeconds(9), Duration.ofSeconds(12)), 
 	            		 
 	            		 
 	                     
 	                     // Login Page
 	                		 transaction("T3_LoginPage",
 	                    httpSampler("Login", login)
 	                        .method(HTTPConstants.POST)
 	                        .contentType(ContentType.APPLICATION_FORM_URLENCODED)
 	                        .rawParam("username", "${Username}")
 	                        .rawParam("password", "${Password}")
 	                        
 	                        
 	                               // Registration
 	                        
 	                        /*.rawParam("user ID", "${UserID}")
 	                      .rawParam("New Password ", "${NewPassword}")
 	                      .rawParam("Repeat Password", "${Repeat Password}")
 	                      .rawParam("First Name ", "${First Name}")
 	                      .rawParam("Email", "${Email}")
 	                      .rawParam("Phone", "${Phone}")
 	                      .rawParam("Address 1", "${Address1}")
 	                      .rawParam("Address 2", "${Address2}")
 	                      .rawParam("City", "${City}")
 	                      .rawParam("State", "${State}")
 	                      .rawParam("Zip", "${Zip}")
 	                      .rawParam("Country ", "${Country}") */
 	                        
 	                        .children(
 	                        		jsr223PostProcessor(
 	                                        "if (prev.responseCode == '200') { prev.successful = true }")
 	                        )
 	                        ),
 	                      //   uniformRandomTimer(Duration.ofSeconds(9), Duration.ofSeconds(12)),     // Think Time 
 	                		 

 	                         
 	                    // Exploring Navigation Bar : - Select Category
 	                		 transaction("T4_SelectCategory",
 	                    forLoopController(2,
 	                        httpSampler("${categoryId}", selectcategories)
 	                            .param("viewCategory", "")
 	                            .param("categoryId", "${categoryId}")
 	                    
 	                        .children(
 	                            regexExtractor("productId", "viewProduct=&amp;productId=([^\"]+)\">") // Correlation using regexExtractor
 	                                .defaultValue("productId_NOT_FOUND")
 	                                .template("$1$")
 	                                .matchNumber(0)
 	                                )
 	                        )
 	                    ),
 	                    
 	                 // uniformRandomTimer(Duration.ofSeconds(9), Duration.ofSeconds(12)),    // Think Time 
 	                		 
 	                		 
 	                    // Select Product
 	                		 transaction("T5_SelectProduct",
 	                    forLoopController(2,
 	                        httpSampler("${productId}",selectproduct)
 	                        
 	                        .children(
 	                                regexExtractor("WorkingItemID", "viewItem=&amp;itemId=([^\"]+)\">") // Correlation using regexExtractor
 	                                    .defaultValue("WorkingItemID_NOT_FOUND")
 	                                    .template("$1$")
 	                                    .matchNumber(0),
 	                                    responseAssertion().containsSubstrings("200")
 	                                    )
 	                    )
 	                    ),
 	                    
 	                	//	uniformRandomTimer(Duration.ofSeconds(9), Duration.ofSeconds(12)),     // Think Time 
 	                		 

 	                    // Selcted Working Item 
 	                		 transaction("T6_SelectWorkingItem",
 	                    forLoopController(2,
 	                            httpSampler("${WorkingItemID}", workingitemid),
 	                            responseAssertion().containsSubstrings("200")
 	                           
 	                        )
 	                    ),
 	                		 //uniformRandomTimer(Duration.ofSeconds(9), Duration.ofSeconds(12)),    // Think Time 
 	                		 
 	                    
 	                    //Oder Form
 	                		 transaction("T7_Orderform",
 	                    forLoopController(1,
 	                            httpSampler("PaymentDetails", orderconfirm)
 	                            
 	                           
 	                            /*.rawParam("card type", "${CardType}")
 	                            .rawParam("Card Number ", "${CardNumber}")
 	                            .rawParam("Expiry Date", "${ExpiryDate}")
 	                            .rawParam("First Name ", "${First Name}")
 	                            .rawParam("Last Name", "${lastname}"
 	                            .rawParam("Address 1", "${Address1}")
 	                            .rawParam("Address 2", "${Address2}")
 	                            .rawParam("City", "${City}")
 	                            .rawParam("State", "${State}")
 	                            .rawParam("Zip", "${Zip}")
 	                            .rawParam("Country ", "${Country}") */
 	                            
 	                            .children(
 	                            		jsr223PostProcessor(
 	                                            "if (prev.responseCode == '200') { prev.successful = true }")
 	                            )
 	                            
 	                              
 	                        )
 	                    ),
 	                   
 	                		// uniformRandomTimer(Duration.ofSeconds(9), Duration.ofSeconds(12)),     // Think Time 
 	                		 
 	                    //Confirm Order
 	                   // httpSampler("Confirm Order", baseUrl + "/actions/Order.action"),
 	                    
 	                    // Logout
 	                		 transaction("T8_Logout",
 	                    httpSampler("Signoff", logoff)
 	                    ),
 	                   
 	                		 
 	                		 
 	                // Payload API
 	                transaction("T9_Payload",
 	                httpSampler("Payload", payload)
 	                   .method(HTTPConstants.POST)
 	                  .contentType(ContentType.APPLICATION_JSON)
 	                 .body("{\"name\": \"${name}\", \"job\": \"${job}\"}")
 	                    ),
 	              // htmlReporter("reports"),
 	               //influxDbListener("http://localhost:8086/api/v2/write?org=PT&bucket=jmeter"),
 	                    resultsTreeVisualizer()
 	                )
 	          
 	            )    
 	            		//.showInGui();
 	            		.run();
         //assertThat(stats.overall().sampleTimePercentile99()).isLessThan(Duration.ofSeconds(5));
 	            //assertThat(stats.overall().errorsCount()).isEqualTo(0);
 	        }
 	    }