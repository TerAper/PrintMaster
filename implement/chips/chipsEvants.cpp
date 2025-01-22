#include "chipsEvants.hpp"

void add_chip(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    int lastCartridgeId = db.add_chip(json);
  
    if(lastCartridgeId){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"},{"chip_id", lastCartridgeId}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void get_chips(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    
    std::cout <<"model id to fatch chips" <<json.dump(4)<<std::endl;
    nlohmann::json answerJson;
    
    answerJson = db.get_chips(json);
    
    if(!answerJson.empty()){
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = answerJson.dump();
        std::cout<< "!answerJson.empty()"<<std::endl;
    }else{
       nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void chipsEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_chip", add_chip);
    evantSwitch.addEvant("/get_chips", get_chips);
   
}
