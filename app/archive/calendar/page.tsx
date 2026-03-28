"use client";

import { MhahPanchang } from 'nepali-panchang-utils';
import NepaliDate from 'nepali-date-converter';
import SunCalc from 'suncalc';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CalendarPage = () => {
  const router = useRouter();

  const panchang = new MhahPanchang();
  const [value, setValue] = useState<any>(null);

  const latitude = 27.7172;
  const longitude = 85.3240;

  const calculatePanchang = (date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const bsDate = new NepaliDate(normalizedDate);
    
    // Panchang calculations
    const calendar = panchang.calendar(normalizedDate, latitude, longitude);
    const sunTimer = panchang.sunTimer(normalizedDate, latitude, longitude);
    const calculate = panchang.calculate(normalizedDate);

    // Moon data using SunCalc
    const moonTimes = SunCalc.getMoonTimes(normalizedDate, latitude, longitude);
    const moonIllumination = SunCalc.getMoonIllumination(normalizedDate);
    const moonPosition = SunCalc.getMoonPosition(normalizedDate, latitude, longitude);

    const moonPhasePercentage = (moonIllumination.phase * 100).toFixed(2);
    const moonIlluminationPercentage = (moonIllumination.fraction * 100).toFixed(2);

    const result = { 
      calendar, 
      sunTimer, 
      calculate,
      normalizedDate,
      bsDate: {
        formatted: bsDate.format("YYYY-MM-DD"),
        year: bsDate.getYear(), 
        month: bsDate.getMonth() + 1,
        day: bsDate.getDate(), 
        weekday: bsDate.getDay(),
        monthName: calendar.Masa.name_en_NP
      },
      moonData: {
        moonrise: moonTimes.rise,
        moonset: moonTimes.set,
        moonPhase: moonPhasePercentage,
        moonIllumination: moonIlluminationPercentage,
        moonAltitude: moonPosition.altitude,
        moonAzimuth: moonPosition.azimuth,
        moonDistance: moonPosition.distance,
        alwaysUp: moonTimes.alwaysUp,
        alwaysDown: moonTimes.alwaysDown
      },
      moonRashi: calculate.Raasi,
      sunRashi: calendar.Raasi
    };

    setValue(result);
  };

  useEffect(() => {
    calculatePanchang(new Date());
  }, []);

  const formatTime = (dateTime: Date) => {
    if (!dateTime || isNaN(dateTime.getTime())) return 'N/A';
    return new Date(dateTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kathmandu'
    });
  };

  const getMoonPhaseName = (phase: number) => {
    const p = parseFloat(phase as any);
    if (p < 6.25) return { name: 'New Moon', emoji: '🌑' };
    if (p < 18.75) return { name: 'Waxing Crescent', emoji: '🌒' };
    if (p < 31.25) return { name: 'First Quarter', emoji: '🌓' };
    if (p < 43.75) return { name: 'Waxing Gibbous', emoji: '🌔' };
    if (p < 56.25) return { name: 'Full Moon', emoji: '🌕' };
    if (p < 68.75) return { name: 'Waning Gibbous', emoji: '🌖' };
    if (p < 81.25) return { name: 'Last Quarter', emoji: '🌗' };
    if (p < 93.75) return { name: 'Waning Crescent', emoji: '🌘' };
    return { name: 'New Moon', emoji: '🌑' };
  };

  if (!value) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9933]"></div>
      </div>
    );
  }

  const moonPhaseInfo = getMoonPhaseName(value.moonData.moonPhase);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Date Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/dashboard"
              className="text-[#FF9933] hover:text-[#FF7722] font-semibold flex items-center gap-2 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-orange-800 flex items-center gap-2">
              🕉️ नेपाली पञ्चाङ्ग
            </h1>
          </div>
        </div>

        {/* Date Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* AD Date Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📅 Gregorian Date (AD)
            </h2>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-blue-600">
                {value.normalizedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-lg text-gray-600">
                {value.calculate.Day.name} ({value.calculate.Day.name_en_UK})
              </p>
            </div>
          </div>

          {/* BS Date Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📆 विक्रम संवत् (BS)
            </h2>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-red-600">
                {value.bsDate.formatted}
              </p>
              <p className="text-xl text-gray-700">
                {value.calendar.Masa.name} ({value.calendar.Masa.name_en_NP})
              </p>
              <p className="text-lg text-gray-600">
                Year: {value.bsDate.year}, Month: {value.bsDate.month}, Day: {value.bsDate.day}
              </p>
            </div>
          </div>
        </div>

        {/* Panchang Elements */}
        <div className="bg-linear-to-r from-orange-100 to-red-100 rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-orange-900 mb-6 text-center">
            पञ्चाङ्ग (Five Limbs of Time)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Tithi */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">तिथि (TITHI)</h3>
              <p className="text-2xl font-bold text-orange-700">
                {value.calculate.Tithi.name}
              </p>
              <p className="text-lg text-gray-600">{value.calculate.Tithi.name_en_NP}</p>
              <p className="text-sm text-gray-500 mt-2">
                Ends: {formatTime(value.calculate.Tithi.end)}
              </p>
            </div>

            {/* Paksha */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">पक्ष (PAKSHA)</h3>
              <p className="text-2xl font-bold text-orange-700">
                {value.calculate.Paksha.name}
              </p>
              <p className="text-lg text-gray-600">{value.calculate.Paksha.name_en_UK}</p>
              <p className="text-sm text-gray-500 mt-2">
                {value.calculate.Paksha.name_en_NP}
              </p>
            </div>

            {/* Nakshatra */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">नक्षत्र (NAKSHATRA)</h3>
              <p className="text-2xl font-bold text-orange-700">
                {value.calculate.Nakshatra.name}
              </p>
              <p className="text-lg text-gray-600">{value.calculate.Nakshatra.name_en_NP}</p>
              <p className="text-sm text-gray-500 mt-2">
                Ends: {formatTime(value.calculate.Nakshatra.end)}
              </p>
            </div>

            {/* Yoga */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">योग (YOGA)</h3>
              <p className="text-2xl font-bold text-orange-700">
                {value.calculate.Yoga.name}
              </p>
              <p className="text-lg text-gray-600">{value.calculate.Yoga.name_en_NP}</p>
              <p className="text-sm text-gray-500 mt-2">
                Ends: {formatTime(value.calculate.Yoga.end)}
              </p>
            </div>

            {/* Karana */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">करण (KARANA)</h3>
              <p className="text-2xl font-bold text-orange-700">
                {value.calculate.Karna.name}
              </p>
              <p className="text-lg text-gray-600">{value.calculate.Karna.name_en_NP}</p>
              <p className="text-sm text-gray-500 mt-2">
                Ends: {formatTime(value.calculate.Karna.end)}
              </p>
            </div>

            {/* Ritu */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">ऋतु (SEASON)</h3>
              <p className="text-2xl font-bold text-orange-700">
                {value.calendar.Ritu.name}
              </p>
              <p className="text-lg text-gray-600">{value.calendar.Ritu.name_en_UK}</p>
            </div>
          </div>
        </div>

        {/* Rashi (Zodiac Signs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sun Rashi */}
          <div className="bg-linear-to-br from-yellow-100 to-orange-100 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-orange-800 mb-4 flex items-center gap-2">
              ☀️ सूर्य राशि (Sun Sign)
            </h2>
            <div className="bg-white rounded-lg p-4">
              <p className="text-3xl font-bold text-yellow-600">
                {value.sunRashi.name}
              </p>
              <p className="text-xl text-gray-700 mt-2">
                {value.sunRashi.name_en_UK}
              </p>
            </div>
          </div>

          {/* Moon Rashi */}
          <div className="bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              🌙 चन्द्र राशि (Moon Sign)
            </h2>
            <div className="bg-white rounded-lg p-4">
              <p className="text-3xl font-bold text-blue-600">
                {value.moonRashi.name}
              </p>
              <p className="text-xl text-gray-700 mt-2">
                {value.moonRashi.name_en_UK}
              </p>
            </div>
          </div>
        </div>

        {/* Sun & Moon Timings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sun Timings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              ☀️ Sun Timings
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-gray-700">🌅 Sunrise</span>
                <span className="text-xl font-bold text-yellow-700">
                  {formatTime(value.sunTimer.sunRise)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-gray-700">🌄 Sunset</span>
                <span className="text-xl font-bold text-orange-700">
                  {formatTime(value.sunTimer.sunSet)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">☀️ Solar Noon</span>
                <span className="text-xl font-bold text-blue-700">
                  {formatTime(value.sunTimer.solarNoon)}
                </span>
              </div>
            </div>
          </div>

          {/* Moon Timings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🌙 Moon Timings
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">🌔 Moonrise</span>
                <span className="text-xl font-bold text-blue-700">
                  {formatTime(value.moonData.moonrise)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="font-medium text-gray-700">🌒 Moonset</span>
                <span className="text-xl font-bold text-indigo-700">
                  {formatTime(value.moonData.moonset)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-gray-700">📏 Distance</span>
                <span className="text-xl font-bold text-purple-700">
                  {Math.round(value.moonData.moonDistance).toLocaleString()} km
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Moon Phase Card */}
        <div className="bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-indigo-900 mb-6 text-center">
            🌙 Moon Phase Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Moon Phase */}
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-6xl mb-3">{moonPhaseInfo.emoji}</div>
              <h3 className="text-2xl font-bold text-indigo-700 mb-2">
                {moonPhaseInfo.name}
              </h3>
              <p className="text-gray-600">Current Phase</p>
            </div>

            {/* Phase Percentage */}
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-5xl font-bold text-purple-600 mb-3">
                {value.moonData.moonPhase}%
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Lunar Cycle
              </h3>
              <p className="text-gray-600">Phase Progress</p>
            </div>

            {/* Illumination */}
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-5xl font-bold text-blue-600 mb-3">
                {value.moonData.moonIllumination}%
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Illuminated
              </h3>
              <p className="text-gray-600">Visible Portion</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CalendarPage;
