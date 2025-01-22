#include "ordersEvants.hpp"

void add_order(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    int lastOrderId = db.add_order(json);
  
    if(lastOrderId){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "order added successfully"},{"order_id", lastOrderId}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void get_orders(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    
    std::cout <<"Date id to fatch orders" <<json.dump(4)<<std::endl;
    nlohmann::json answerJson;

    answerJson = db.get_orders(json);
    
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

void ordersEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_order", add_order);
    evantSwitch.addEvant("/get_orders", get_orders);
   
}
