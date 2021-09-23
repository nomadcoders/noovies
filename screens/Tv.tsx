import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery, useQueryClient } from "react-query";
import { tvApi, TVResponse } from "../api";
import HList from "../components/HList";
import Loader from "../components/Loader";

const Tv = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading: todayLoading, data: todayData } = useQuery(
    ["tv", "today"],
    tvApi.airingToday
  );
  const { isLoading: topLoading, data: topData } = useQuery(
    ["tv", "top"],
    tvApi.topRated
  );
  const { isLoading: trendingLoading, data: trendingData } = useQuery(
    ["tv", "trending"],
    tvApi.trending
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["tv"]);
    setRefreshing(false);
  };
  const loading = todayLoading || topLoading || trendingLoading;

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingVertical: 30 }}
    >
      {trendingData ? (
        <HList title="Trending TV" data={trendingData.results} />
      ) : null}
      {todayData ? (
        <HList title="Airing Today" data={todayData.results} />
      ) : null}
      {topData ? <HList title="Top Rated TV" data={topData.results} /> : null}
    </ScrollView>
  );
};
export default Tv;
