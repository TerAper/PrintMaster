#include "engineStarter.hpp"
#include "evantSwitch.hpp"
#include <boost/beast/http/status.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/asio.hpp>
#include <boost/beast/http/verb.hpp>
#include <cppconn/connection.h>


namespace beast = boost::beast;             // from <boost/beast.hpp>
namespace http = beast::http;               // from <boost/beast/http.hpp>

extern EvantSwitch evantSwitch;

void EngineStarter::runSession(boost::asio::ip::tcp::socket socket, ConnectionPool *connectionsPool)
{
    try{
    boost::beast::flat_buffer buffer;
    boost::beast::http::request<boost::beast::http::string_body> req;
    boost::beast::http::read(socket, buffer, req);
    boost::beast::http::response<boost::beast::http::string_body> res;
    
    if (req.method() == boost::beast::http::verb::options) {
        res.result(boost::beast::http::status::no_content);
        res.set(boost::beast::http::field::access_control_allow_origin, "*");
        res.set(boost::beast::http::field::access_control_allow_methods, "POST, GET, OPTIONS");
        res.set(boost::beast::http::field::access_control_allow_headers, "Content-Type");
        
    }else{
       res.set(boost::beast::http::field::access_control_allow_origin, "*");
       res.set(boost::beast::http::field::access_control_allow_methods, "POST, GET, OPTIONS");
       res.set(boost::beast::http::field::access_control_allow_headers, "Content-Type");
       FunctionPtr  handler = evantSwitch.getEvantHendler(req);
      if(handler != nullptr){
         std::thread::id threadId = std::this_thread::get_id();
         long threadIdAsLong = std::hash<std::thread::id>()(threadId);

         sql::Connection* conn = connectionsPool->getConnection(threadIdAsLong);
         DataBase db(conn);
         handler(req,res,db);
         connectionsPool->returnConnection(threadIdAsLong);
      }
    }
     http::write(socket, res);
   }catch(std::exception& ex){
      std::cout << "Exeption : " <<ex.what() << std::endl;
   }  
}

void EngineStarter::evantSwitchInitalaizer(EvantSwitch &evantsMap){
    clientsEvantsInitalaizer(evantsMap);
    brandsEvantsInitalaizer(evantsMap);
    modelsEvantsInitalaizer(evantsMap);
    printerEvantsInitalaizer(evantsMap);
    cartridgesEvantsInitalaizer(evantsMap);
    chipsEvantsInitalaizer(evantsMap);
    client_printersEvantsInitalaizer(evantsMap);
    client_printer_cartridgesEvantsInitalaizer(evantsMap);
    client_addressesEvantsInitalaizer(evantsMap);
    client_phone_numbersEvantsInitalaizer(evantsMap);
    ordersEvantsInitalaizer(evantsMap);
    repair_partsEvantsInitalaizer(evantsMap);

}