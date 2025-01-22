#include "clients_phone_numbersEvants.hpp"

void add_client_phone_numbers(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    int lastInsertedClientPhoneNumber = db.add_client_phone_numbers(json);
    if(lastInsertedClientPhoneNumber){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"}, {"phone_number_id", lastInsertedClientPhoneNumber}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void get_client_phone_numbers(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    nlohmann::json answerJson;
    answerJson = db.get_client_phone_numbers(json);

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

void update_client_phone_number(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    if(db.update_client_phone_number(json)){
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

void delete_client_phone_number(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    if(db.delete_client_phone_number(json)){
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

void client_phone_numbersEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_client_phone_numbers", add_client_phone_numbers);
    evantSwitch.addEvant("/get_client_phone_numbers", get_client_phone_numbers);
    evantSwitch.addEvant("/update_client_phone_number", update_client_phone_number);
    evantSwitch.addEvant("/delete_client_phone_number", delete_client_phone_number);
}
