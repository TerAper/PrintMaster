#include "cartridgesEvants.hpp"

void add_cartridge(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    int lastModelId = db.add_cartridge(json);
  
    if(lastModelId){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"},{"cartridge_id", lastModelId}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void get_cartridges(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    
    std::cout <<"model id to fatch cartridges" <<json.dump(4)<<std::endl;
    nlohmann::json answerJson;
    
    answerJson = db.get_cartridges(json);
    
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

void cartridgesEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_cartridge", add_cartridge);
    evantSwitch.addEvant("/get_cartridges", get_cartridges);
   
}
