import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "../services/axios"
import WriteReview from "./WriteReview"
const Review = ({ product }) => {

    const reviewsData = product?.reviews || {};

    const averageRating = Number(reviewsData.average_rating || 0);
    const totalReviews = Number(reviewsData.total || 0);
    const totalRating = Number(reviewsData.total_rating || 5);

    let ratingPercentage = {};

    try {
        ratingPercentage =
            typeof reviewsData.percentage === 'string'
                ? JSON.parse(reviewsData.percentage || '{}')
                : reviewsData.percentage || {};
    } catch (error) {
        ratingPercentage = {};
    }
    // const ratingPercentage = JSON.parse(
    //     product?.reviews?.percentage || "{}"
    // );

    // const totalReviews = product?.reviews?.total || 0;

    const [reviews, setReviews] = useState([]);

    const fetchReviews = async () => {

        try {

            const response = await axios.get(
                `/products/${product.id}/reviews`
            );

            console.log("Reviews:", response.data);

            setReviews(
                response.data.data || []
            );


        } catch (error) {

            console.log(
                error.response?.data || error.message
            );

        }

    };

    useEffect(() => {

        if (product?.id) {
            fetchReviews();
        }

    }, [product?.id]);

    const timeAgo = (date) => {

        const now = new Date();
        const createdDate = new Date(date);

        const seconds = Math.floor(
            (now - createdDate) / 1000
        );


        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };


        for (const interval in intervals) {

            const value = Math.floor(
                seconds / intervals[interval]
            );

            if (value >= 1) {

                return `${value} ${interval}${value > 1 ? 's' : ''} ago`;

            }

        }


        return "Just now";

    };
    return (

        <View style={styles.container}>


            {/* Rating Overview */}

            <View style={styles.ratingCard}>
                <View style={styles.ratingCard1}>

                    <View>

                        <Text style={styles.ratingNumber}>
                            {product?.reviews?.average_rating}
                        </Text>

                        <Text style={styles.ratingLabel}>
                            out of {product?.reviews?.total_rating} stars
                        </Text>

                        <View style={styles.starsRow}>

                            {
                                [1, 2, 3, 4, 5].map((star) => {

                                    let iconName = "star-outline";

                                    if (product?.reviews?.average_rating >= star) {
                                        iconName = "star";
                                    }
                                    else if (product?.reviews?.average_rating >= star - 0.5) {
                                        iconName = "star-half";
                                    }

                                    return (
                                        <Ionicons
                                            key={star}
                                            name={iconName}
                                            size={20}
                                            color="#FFB020"
                                        />
                                    );

                                })
                            }

                        </View>



                    </View>


                    <View style={styles.reviewCount}>

                        <Text style={styles.totalReview}>
                            {product?.reviews?.total}
                        </Text>

                        <Text style={styles.ratingLabel}>
                            Reviews
                        </Text>

                    </View>




                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <View style={{ borderTopWidth: 1, borderColor: '#ccc', width: '100%' }}>
                        <View style={{ padding: 10 }}>

                            {[5, 4, 3, 2, 1].map((star) => {

                                // const count = Math.round(
                                //     (ratingPercentage[star] / 100) * totalReviews
                                // );
                                const percentage = Number(ratingPercentage?.[star] || 0);
                                const total = Number(totalReviews || 0);

                                const count = Math.round(
                                    (percentage / 100) * total
                                );

                                return (
                                    <View
                                        key={star}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginVertical: 5
                                        }}
                                    >

                                        <Text style={{ width: 50 }}>
                                            {star} ⭐
                                        </Text>


                                        <View
                                            style={{
                                                flex: 1,
                                                height: 8,
                                                backgroundColor: '#ddd',
                                                borderRadius: 10,
                                                marginHorizontal: 10
                                            }}
                                        >

                                            <View
                                                style={{
                                                    width: `${ratingPercentage[star] || 0}%`,
                                                    height: 8,
                                                    backgroundColor: '#FFB020',
                                                    borderRadius: 10
                                                }}
                                            />

                                        </View>


                                        <Text>
                                            {count ?? 0} reviews
                                        </Text>


                                    </View>
                                );

                            })}

                        </View>
                    </View>
                </View>
                <WriteReview />
            </View>




            {/* Review List */}
            {/* <Text>{JSON.stringify(reviews)}</Text> */}

            {
                reviews.map((review) => (

                    <View
                        key={review.id}
                        style={styles.reviewCard}
                    >


                        <View style={styles.reviewHeader}>


                            {/* Avatar */}

                            <View style={styles.avatarPlaceholder}>

                                <Text style={styles.avatarText}>
                                    {review.name.charAt(0)}
                                </Text>

                            </View>



                            <View style={styles.reviewerInfo}>


                                <Text style={styles.reviewerName}>
                                    {review.name}
                                </Text>



                                <View style={styles.reviewStars}>

                                    {
                                        Array.from({
                                            length: review.rating
                                        }).map((_, index) => (

                                            <Ionicons
                                                key={index}
                                                name="star"
                                                size={14}
                                                color="#FFB020"
                                            />

                                        ))
                                    }

                                </View>


                            </View>



                            <Text style={styles.reviewDate}>
                                {timeAgo(review.created_at)}
                            </Text>


                        </View>



                        <Text style={styles.reviewComment}>
                            {review.title}
                        </Text>
                        <Text style={styles.reviewComment}>
                            {review.comment}
                        </Text>


                    </View>

                ))
            }


        </View>

    );
};


export default Review;



const styles = StyleSheet.create({

    container: {
        padding: 16,
        backgroundColor: '#F8F9FA',
    },


    ratingCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
    },
    ratingCard1: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },


    ratingNumber: {
        fontSize: 40,
        fontWeight: '700',
        color: '#222',
    },


    ratingLabel: {
        color: '#777',
        fontSize: 14,
    },


    starsRow: {
        flexDirection: 'row',
        marginTop: 8,
    },


    reviewCount: {
        alignItems: 'center',
    },


    totalReview: {
        fontSize: 24,
        fontWeight: '700',
    },


    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
    },


    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },


    avatarPlaceholder: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#E9ECEF',
        justifyContent: 'center',
        alignItems: 'center',
    },


    avatarText: {
        fontSize: 18,
        fontWeight: '700',
    },


    reviewerInfo: {
        flex: 1,
        marginLeft: 10,
    },


    reviewerName: {
        fontSize: 15,
        fontWeight: '700',
    },


    reviewStars: {
        flexDirection: 'row',
        marginTop: 3,
    },


    reviewDate: {
        color: '#888',
        fontSize: 12,
    },


    reviewComment: {
        marginTop: 12,
        color: '#555',
        lineHeight: 20,
        fontSize: 14,
    },

});