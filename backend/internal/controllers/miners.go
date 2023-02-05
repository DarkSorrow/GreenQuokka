package controllers

import (
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type MinerPagination struct {
	Total  int `json:"total"`
	Offset int `json:"offset"`
	Limit  int `json:"limit"`
}

type MinerDeals struct {
	Total        int `json:"total"`
	noPenalties  int `json:"noPenalties"`
	successRate  int `json:"successRate"`
	averagePrice int `json:"averagePrice"`
	dataStored   int `json:"dataStored"`
	slashed      int `json:"slashed"`
}
type MinerScores struct {
	Total                  int `json:"total"`
	Uptime                 int `json:"uptime"`
	StorageDeals           int `json:"storageDeals"`
	CommittedSectorsProofs int `json:"committedSectorsProofs"`
}

type Miner struct {
	Address         string  `json:"address"`
	Status          bool    `json:"status"`
	UptimeAverage   float64 `json:"uptimeAverage"`
	Price           string  `json:"price"`
	RawPower        string  `json:"rawPower"`
	QualityAdjPower string  `json:"qualityAdjPower"`
	IsoCode         string  `json:"isoCode"`
	City            string  `json:"city"`
	Region          string  `json:"region"`
	FreeSpace       string  `json:"freeSpace"`
	StorageDeals    string  `json:"storageDeals"`
	Scores          string  `json:"scores"`
}

type MinersList struct {
	Pagination MinerPagination `json:"pagination"`
	Miners     Miner           `json:"miners"`
}

func (h ApiHandler) GetMiners(ctx *fiber.Ctx) error {
	url := "https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromCarTravel?distance=100&vehicle=SmallDieselCar"
	_, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Print(err.Error())
	}
	return nil
}
