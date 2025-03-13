import { useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

function Users() {
  const { loading, error, users } = useFetchUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebouncedValue(searchTerm, 300);

  const filteredUsers = users.filter(
    (user: any) =>
      user.name.first.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      user.name.last.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedValue.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>
        {item.name.first} {item.name.last}
      </Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </View>
  );

  if (loading) return <Text style={styles.message}>Loading...</Text>;
  if (error) return <Text style={styles.message}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.login.uuid}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <TextInput
            placeholder="Search users..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.input}
            accessibilityLabel="Search users"
          />
        }
        ListEmptyComponent={
          debouncedValue !== "" ? (
            <Text style={styles.message}>
              No users found matching "{debouncedValue}".
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  message: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 20, // Prevents cutoff at the bottom
  },
  userCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
  },
});

export default Users;
