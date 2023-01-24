package services

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func getZapLevel(level string) zapcore.Level {
	switch level {
	case "Info":
		return zapcore.InfoLevel
	case "Warn":
		return zapcore.WarnLevel
	case "Debug":
		return zapcore.DebugLevel
	case "Error":
		return zapcore.ErrorLevel
	case "Fatal":
		return zapcore.FatalLevel
	default:
		return zapcore.InfoLevel
	}
}

var logLevelSeverity = map[zapcore.Level]int{
	zapcore.DebugLevel:  20,
	zapcore.InfoLevel:   30,
	zapcore.WarnLevel:   40,
	zapcore.ErrorLevel:  50,
	zapcore.DPanicLevel: 53,
	zapcore.PanicLevel:  56,
	zapcore.FatalLevel:  60,
}

// CustomEncodeLevel Allow to set the same int number as the nodejs pino logger
func customEncodeLevel(level zapcore.Level, enc zapcore.PrimitiveArrayEncoder) {
	enc.AppendInt(logLevelSeverity[level])
}

// name is the name of the service that was started
// Level is the log level you wish to have ["Info", "Warn", "Debug", "Error", "Fatal"]
func NewLogger(name string, level string) *zap.Logger {
	hostname := "Unknown"
	if hn, errhs := os.Hostname(); errhs != nil {
		hostname = hn
	}
	cfg := zap.Config{
		Encoding:         "json",
		Level:            zap.NewAtomicLevelAt(getZapLevel(level)),
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stdout"},
		EncoderConfig: zapcore.EncoderConfig{
			MessageKey:   "msg",
			LevelKey:     "level",
			EncodeLevel:  customEncodeLevel,
			TimeKey:      "time",
			EncodeTime:   zapcore.ISO8601TimeEncoder,
			CallerKey:    "caller",
			EncodeCaller: zapcore.ShortCallerEncoder,
		},
		InitialFields: map[string]interface{}{
			"n_name": name,
			"n_host": hostname,
		},
	}
	log, _ := cfg.Build()
	return log
}
