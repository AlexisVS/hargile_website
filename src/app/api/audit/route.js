export async function POST(req) {
    try {
        const body = await req.json();
        const {url, firstName, lastName, email, isForOwnCompany, industry} = body;

        if (!url) {
            return Response.json({message: "Missing URL"}, {status: 400});
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (error) {
            return Response.json({message: "Invalid URL format"}, {status: 400});
        }

        const apiKey = process.env.PAGESPEED_API_KEY;

        if (!apiKey) {
            return Response.json({message: "API key is not configured"}, {status: 500});
        }

        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
            url
        )}&key=${apiKey}&category=performance&category=seo&category=accessibility&category=best-practices`;

        const response = await fetch(apiUrl, {
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            return Response.json({
                message: `PageSpeed API returned error: ${response.status}`
            }, {status: response.status});
        }

        const data = await response.json();

        return Response.json({
            success: true,
            auditResults: data,
            submittedData: {
                firstName,
                lastName,
                email,
                url,
                isForOwnCompany,
                industry,
            },
        });
    } catch (error) {
        return Response.json({
            message: "Internal server error",
            error: error.message
        }, {status: 500});
    }
}
