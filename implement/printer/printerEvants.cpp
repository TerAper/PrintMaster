#include "printerEvants.hpp"
#include <nlohmann/json_fwd.hpp>

void addPrinter(const request &req, response &res, DataBase &db){
     nlohmann::json json = nlohmann::json::parse(req.body());
    std::cout << "XX "<<json.dump(4) << std::endl;
     int lastPrinertId = db.addPrinter(json);
     std:: cout << "printer id for return" << lastPrinertId<<std::endl;
   if(lastPrinertId){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "printer added successfully"},{"printer_id", lastPrinertId}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
};

void getPrinters(const request &req, response &res, DataBase &db){
     nlohmann::json json = nlohmann::json::parse(req.body());
     nlohmann::json answerJson;
     answerJson = db.getPrinters(json);
   if(!answerJson.empty()){
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = answerJson.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = errorResponse.dump();
    }
};

void printerEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_printer", addPrinter);
    evantSwitch.addEvant("/get_printers", getPrinters);
}
