#include "repair_partsEvants.hpp"

void add_repair_part(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    int lastInsertedRepairPartId = db.add_repair_part(json);

    if(lastInsertedRepairPartId){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"},{"id", lastInsertedRepairPartId} };
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void get_repair_parts(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    nlohmann::json answerJson;
    answerJson = db.get_repair_parts(json);

    if(!answerJson.empty()){
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = answerJson.dump();
        std::cout<< "!answerJson.empty()"<<std::endl;
    }else{
       nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = errorResponse.dump();
    }
}

void update_repair_part(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    if(db.update_repair_part(json)){
        std::cout << "sucsses" << std::endl;
         nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
       nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void delete_repair_part(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    if(db.delete_repair_part(json)){
        std::cout << "sucsses" << std::endl;
         nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
       nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void repair_partsEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_repair_part", add_repair_part);
    evantSwitch.addEvant("/get_repair_parts", get_repair_parts);
    evantSwitch.addEvant("/update_repair_part", update_repair_part);
    evantSwitch.addEvant("/delete_repair_part", delete_repair_part);
}
