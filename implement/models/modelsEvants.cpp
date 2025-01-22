#include "modelsEvants.hpp"

void add_model(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    int lastModelId = db.add_model(json);
  
    if(lastModelId){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "model added successfully"},{"model_id", lastModelId}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void get_models(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    
    std::cout <<"brand id to fatch models" <<json.dump(4)<<std::endl;
    nlohmann::json answerJson;

    answerJson = db.get_models(json);
    
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

void modelsEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_model", add_model);
    evantSwitch.addEvant("/get_models", get_models);
   
}
