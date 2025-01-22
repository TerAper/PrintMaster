#include "brandsEvants.hpp"

void add_brand(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    int lastBrandId = db.add_brand(json);
  
    if(lastBrandId){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"},{"brand_id", lastBrandId}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void get_brands(const request &req, response &res, DataBase &db){
    nlohmann::json json ;
    nlohmann::json answerJson;

    answerJson = db.get_brands(json);
    
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

void brandsEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_brand", add_brand);
    evantSwitch.addEvant("/get_brands", get_brands);
   
}
