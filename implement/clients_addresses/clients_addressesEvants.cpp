#include "clients_addressesEvants.hpp"

void add_client_addresses(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    int lastInsertedClientAddress = db.add_client_addresses(json);
    if(lastInsertedClientAddress){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"},{"address_id",lastInsertedClientAddress}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void get_client_addresses(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    nlohmann::json answerJson;
    answerJson = db.get_client_addresses(json);

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

void update_client_address(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    if(db.update_client_address(json)){
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

void delete_client_address(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    if(db.delete_client_address(json)){
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

void client_addressesEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_client_addresses", add_client_addresses);
    evantSwitch.addEvant("/get_client_addresses", get_client_addresses);
    evantSwitch.addEvant("/update_client_address", update_client_address);
    evantSwitch.addEvant("/delete_client_address", delete_client_address);
}
